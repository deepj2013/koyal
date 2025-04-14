import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { uploadJSONFileToS3 } from "../services/s3Service.js"
import APIError from '../exception/errorHandler.js'


const pollForResult = async (url, socket, interval = 3000, maxAttempts = 5) => {

    for (let i = 0; i < maxAttempts; i++) {
        const res = await axios.get(url)
        if (res.status === 200) return res.data
        if (res.status === 404) {
            console.log("getting error 404 from polling")
        }
        await new Promise(resolve => setTimeout(resolve, interval))
    }
    console.log("Max attempts reached while polling")
    socket.emit('processing-error', { status: 'timeout', message: 'Timeout while polling result' })
    throw new Error('Timeout while polling result')
}

export const audioProcess = async (req, res, next) => {
    try {
        const { audio, english_priority = false } = req.body;
        const { email } = req.user;

        if (!audio) return res.status(400).json({ success: false, message: 'Audio URL required' })

        //1. 🔥 Parallel API calls for Emotion and Transcriber submit
        const [emotionSubmit, transcriberSubmit] = await Promise.all([
            axios.post(`${process.env.PY_EMOTION_BASE_URL}/submit`, { data: audio }),
            axios.post(`${process.env.PY_TRANSCRIBER_BASE_URL}/submit`, {
                data: audio,
                english_priority: english_priority === true || english_priority === 'true'
            })
        ])

        const emotionCallId = emotionSubmit.data.call_id

        const transcriberCallId = transcriberSubmit.data.call_id


        const [emotionData, transcriptData] = await Promise.all([
            pollForResult(`${process.env.PY_EMOTION_BASE_URL}/result/${emotionCallId}`),
            pollForResult(`${process.env.PY_TRANSCRIBER_BASE_URL}/result/${transcriberCallId}`),
        ]);

        const emotionKey = `emotion_data-${uuid()}.json`

        const transcriptKey = `word_timestamps-${uuid()}.json`

        // Step 2: Upload both results to S3 in parallel
        const [emotionUrl, transcriptUrl] = await Promise.all([
            uploadJSONFileToS3(emotionData, emotionKey, email),
            uploadJSONFileToS3(transcriptData, transcriptKey, email),
        ]);

        // 3. 🎬 Scene Endpoint
        const sceneSubmit = await axios.post(`${process.env.PY_SCENE_BASE_URL}/submit`, {
            word_timestamps: transcriptUrl,
            emotion_data: emotionUrl,
            audio_file: audio
        })

        const sceneCallId = sceneSubmit.data.call_id

        const sceneData = await pollForResult(`${process.env.PY_SCENE_BASE_URL}/result/${sceneCallId}`)

        const sceneKey = `scenes-${uuid()}.json`
        const sceneUrl = await uploadJSONFileToS3(sceneData, sceneKey, email)

        return res.status(200).json({
            success: true,
            audio,
            emotion_url: emotionUrl,
            transcript_url: transcriptUrl,
            scene_url: sceneUrl,
            scene_data: sceneData
        })

    } catch (error) {
        console.error(error)
        throw new APIError({
            message: 'Audio processing failed',
            status: 500,
            isOperational: true,
            data: error.message
        })
    }
}

export const audioprocessedSocket = async (data) => {
    const { audio, socket, socketId, english_priority = false, user } = data
    const userEmail = user?.email;
    console.log("userEmail", userEmail);
    try {
        socket.emit('processing-status', { status: 'started', message: 'Audio processing started' })

        // Emit that both processing tasks are starting
        socket.emit('processing-status', { status: 'emotion-processing', message: 'Processing emotions...' });
        socket.emit('processing-status', { status: 'transcriber-processing', message: 'Processing transcription...' });

        //1. 🔥 Fire both emotion and transcriber submit calls in parallel
        const [emotionSubmit, transcriberSubmit] = await Promise.all([
            axios.post(`${process.env.PY_EMOTION_BASE_URL}/submit`, {
                data: audio
            }),
            axios.post(`${process.env.PY_TRANSCRIBER_BASE_URL}/submit`, {
                data: audio,
                english_priority: english_priority
            })
        ]);

        const emotionCallId = emotionSubmit.data.call_id;
        const transcriberCallId = transcriberSubmit.data.call_id;

        socket.emit('processing-status', { status: 'emotion-call-id', message: 'Emotion submitted', data: emotionCallId });
        socket.emit('processing-status', { status: 'transcriber-call-id', message: 'Transcriber submitted', data: transcriberCallId });


        // Fire both polling tasks in parallel
        const [emotionData, transcriptData] = await Promise.all([
            pollForResult(`${process.env.PY_EMOTION_BASE_URL}/result/${emotionCallId}`, socket),
            pollForResult(`${process.env.PY_TRANSCRIBER_BASE_URL}/result/${transcriberCallId}`)
        ]);

        //3.🔥 Upload to S3 in parallel
        const [emotionUrl, transcriptUrl] = await Promise.all([
            uploadJSONFileToS3(emotionData, `emotion_data-${uuid()}.json`, userEmail),
            uploadJSONFileToS3(transcriptData, `word_timestamps-${uuid()}.json`, userEmail)
        ]);

        socket.emit('processing-status', { status: 'emotion-complete', message: 'Emotion processing complete' });
        socket.emit('processing-status', { status: 'transcriber-completed', message: 'Transcription complete' });

        // 3. 🔥 Scene Processing
        socket.emit('processing-status', { status: 'scene-processing', message: 'Processing scenes...' })
        const sceneSubmit = await axios.post(`${process.env.PY_SCENE_BASE_URL}/submit`, {
            word_timestamps: transcriptUrl,
            emotion_data: emotionUrl,
            audio_file: audio
        })
        const sceneCallId = sceneSubmit.data.call_id
        socket.emit('processing-status', { status: 'scene-complete', message: 'Scene processing complete' })

        // 4. 🔥 Scene Result Processing
        socket.emit('processing-status', { status: 'result-processing', message: 'Processing scenes...' })
        const sceneData = await pollForResult(`${process.env.PY_SCENE_BASE_URL}/result/${sceneCallId}`)
        const sceneUrl = await uploadJSONFileToS3(sceneData, "scenes-${uuid()}.json", userEmail)
        socket.emit("processing-status", { status: 'result-completed', message: 'Scene processing complete' })

        // 5. 🔥 Send Results
        socket.emit('processing-status', { status: 'sending-results', message: 'Sending results...' })

        //🚀 Emit that processing is complete
        socket.emit('processing-complete', {
            success: true,
            audio,
            emotion_url: emotionUrl,
            transcript_url: transcriptUrl,
            scene_url: sceneUrl,
            scene_data: sceneData
        })

    } catch (error) {
        console.error('Audio processing error:', error)
        socket.emit('processing-error', {
            success: false,
            message: error.message || 'Audio processing failed'
        })
    }
}

export const lyricsProcessedSocket = async (data) => {
    const { scenePath, mode, socket, socketId, user } = data;

    if (!scenePath || !mode) return socket.emit('processing-error', { status: 'error', message: 'Missing required parameters scene_path and mode' })

    const email = user?.email;
    console.log("email is--->", email);
    try {
        socket.emit('processing-status', { status: 'started', message: 'Lyrics processing started' });

        const lyricsSubmit = await axios.post(`${process.env.PY_LYRICS_BASE_URL}/submit`, {
            mode,
            scene_path: scenePath
        });
        socket.emit('processing-status', { status: 'end', message: 'Lyrics processing end' });

        const lyricsCallId = lyricsSubmit.data.call_id;
        socket.emit('processing-status', { status: 'lyrics-call-id', message: 'Lyrics submitted', data: lyricsCallId });

        const storyData = await pollForResult(`${process.env.PY_LYRICS_BASE_URL}/result/${lyricsCallId}`, socket);
        const sceneKey = `story_elements-${uuid()}.json`
        const stroyUrl = await uploadJSONFileToS3(storyData, sceneKey, email);

        socket.emit('processing-status', { status: 'lyrics-complete', message: 'Lyrics processing complete' });

        socket.emit('processing-complete', {
            success: true,
            sceneUrl: stroyUrl,
            sceneData: storyData
        })

        socket.emit('processing-status', { status: 'lyrics-complete', message: 'Lyrics processing complete' });
    } catch (error) {
        console.error('Audio processing error:', error)
        socket.emit('processing-error', {
            success: false,
            message: error.message || 'Audio processing failed'
        })
    }
}

export const themeCharacterSocket = async (data) => {
    const { scenePath, mode, socket, socketId, user, storyInstructions, newStory, storyElementsPath, characterName, avatarFolderPath, characterDetails } = data;
    const email = user?.email;
    console.log("email is--->", email);

    if (!scenePath || !mode) {
        return socket.emit('processing-error', {
            status: 'error',
            message: 'Missing required parameters: scenePath and mode',
        });
    }

    try {
        let payload = {
            scenes_path: scenePath,
            Story_elements: storyElementsPath,
        };

        if (mode === 'edit-story') {
            if (!storyInstructions) {
                return socket.emit('processing-error', {
                    status: 'error',
                    message: 'Missing storyInstructions for edit-story',
                });
            }

            payload = { ...payload, mode: 'edit-story', story_instructions: storyInstructions };
        }

        if (mode === 'edit-character') {
            if (!newStory) {
                return socket.emit('processing-error', {
                    status: 'error',
                    message: 'Missing newStory for edit-character',
                });
            }

            payload = { ...payload, mode: 'edit-character', new_story: newStory };
        }

        if (mode === 'custom-avatar') {
            if (!characterDetails || !avatarFolderPath) {
                return socket.emit('processing-error', {
                    status: 'error',
                    message: 'Missing characterDetails or avatarFolderPath for custom-avatar',
                });
            }

            const avatarSubmit = await axios.post('https://yourapi.com/avatar_endpoint/submit', {
                images_path: avatarFolderPath,
                character_details: characterDetails,
            });

            const avatarCallId = avatarSubmit.data.call_id;

            const avatarResult = await pollForResult(`https://yourapi.com/avatar_endpoint/result/${avatarCallId}`);
            return socket.emit('avatar-images-generated', { ...avatarResult });
        }

        // For edit-story or edit-character
        const response = await axios.post(`${process.env.PY_LYRICS_BASE_URL}/ submit`, payload);
        const callId = response.data.call_id;

        socket.emit('processing-started', { call_id: callId });

        const result = await pollForResult(`${process.env.PY_LYRICS_BASE_URL}${callId}`);

        socket.emit('processing-success', {
            status: 'success',
            mode,
            story_elements: result.story_elements,
        });

    } catch (error) {
        console.error('Error in themeCharacterSocket:', error?.message || error);
        return socket.emit('processing-error', {
            status: 'error',
            message: error?.message || 'An unexpected error occurred.',
        });
    }
}