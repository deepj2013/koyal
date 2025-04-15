import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { uploadFileToS3, uploadJSONFileToS3 } from "../services/s3Service.js"
import APIError, { HttpStatusCode } from '../exception/errorHandler.js'
import userTask from '../models/userTaskModel.js'
import userAudio from '../models/userAudioModel.js'
import { toStringId } from '../utils/mongo.js'
import userTaskLog from '../models/userTaskLogModel.js'
import { editStoryModes, taskLogStatusENUM, taskStatusENUM, userTaskLogNameEnum } from '../enums/ENUMS.js'


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
    const { audio, groupId, socket, socketId, english_priority = false, user } = data
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

        // 🧠 SAVE TO DB RIGHT HERE 👇
        // we can do this by using bull MQ when we implement the bullMQ
        const task = await userTask.findOne({ groupId: groupId, userId: toStringId(user._id) });
        if (!task) {
            console.log("task is not present ")
            socket.emit('processing-error', {
                success: false,
                message: error.message || 'task is not present'
            })
        }

        const existingAudio = await userAudio.findOne({ groupId: groupId, userId: toStringId(user._id) });

        const log = await userTaskLog.create({
            taskId: toStringId(task._id),
            userId: toStringId(user._id),
            taskName: userTaskLogNameEnum.AUDIO_PROCESSING,
            groupId: groupId,
            audioDetails: {
                audioId: existingAudio?._id,
                audioUrl: audio,
                originalFileName: existingAudio?.fileName,
                collectionName: "SINGE-UPLOAD",
                audioJSON: JSON.stringify({
                    emotionUrl,
                    transcriptUrl,
                    sceneUrl,
                    sceneData
                })
            },
            status: taskLogStatusENUM.COMPLETED
        });

        await userTask.findByIdAndUpdate(task._id, {
            $push: { taskLogIds: log._id },
            numberofTaskLog: (task.numberofTaskLog || 0) + 1,
            stage: 2,
            status: taskStatusENUM.COMPLETED
        });

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
    const { mode, socket, socketId, user, scenes_path, Story_elements, story_instructions, storyS3Key, new_story } = data;

    if (!scenes_path || !mode) return socket.emit('processing-error', { status: 'error', message: 'Missing required parameters scene_path and mode' })

    const email = user?.email;
    try {
        socket.emit('processing-status', { status: 'started', message: 'Lyrics processing started' });

        if (mode === editStoryModes.CREATE_STORY) {
            const lyricsSubmit = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                mode,
                scenes_path
            });
            socket.emit('processing-status', { status: 'end', message: 'Lyrics processing end' });

            const lyricsCallId = lyricsSubmit.data.call_id;
            socket.emit('processing-status', { status: 'lyrics-call-id', message: 'Lyrics submitted', data: lyricsCallId });

            const storyData = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${lyricsCallId}`, socket);
            const storyKey = `story_elements-${uuid()}.json`
            const stroyUrl = await uploadJSONFileToS3(storyData, storyKey, email);

            socket.emit('processing-status', { status: 'lyrics-complete', message: 'Lyrics processing complete' });

            socket.emit('processing-complete', {
                success: true,
                sceneUrl: scenes_path,
                storyUrl: stroyUrl,
                storyData: storyData,
                storyKey
            })
        } else if (mode === editStoryModes.EDIT_STORY) {
            if (!story_instructions || !Story_elements || !storyS3Key) {
                return socket.emit('processing-error', {
                    status: 'error',
                    message: 'Missing storyInstructions,storyElement storyS3Key for edit-story',
                });
            }

            socket.emit('processing-status', {
                status: 'started',
                message: 'Editing story details..',
            });

            try {
                const response = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/ submit`, {
                    mode,
                    scenes_path,
                    Story_elements,
                    story_instructions
                });
                const callId = response.data.call_id;

                console.log("EDIT LYRICS call ID--->", callId)

                socket.emit('processing-status', { call_id: callId });

                const result = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`);

                // 🔁 Replace the existing file in S3 using the same key
                const updatedStoryUrl = await uploadJSONFileToS3(result, storyS3Key, email);

                socket.emit('processing-status', { status: 'lyrics-complete', message: 'Lyrics processing complete' });

                socket.emit('processing-complete', {
                    success: true,
                    storyUrl: updatedStoryUrl,
                    storyElements: result,
                    sceneKey: storyS3Key,
                    scenes_path
                })
            } catch (error) {
                console.error("Error in edit-character flow:", error);
                socket.emit('processing-error', {
                    success: false,
                    message: error.message || 'Failed to edit story',
                });
            }
        } else if (mode === editStoryModes.EDIT_CHARACTER) {
            if (!scenes_path || !Story_elements || !new_story || !storyS3Key) {
                return socket.emit('processing-error', {
                    status: 'error',
                    message: 'Missing scenesPath, storyElement, newStory or sceneKey for edit-character',
                });
            }

            socket.emit('processing-status', {
                status: 'started',
                message: 'Editing character details from updated narrative...',
            });

            try {
                // Submit the request to edit-character endpoint
                const response = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                    mode,
                    scenes_path,
                    Story_elements,
                    new_story,
                });

                const callId = response.data.call_id;
                console.log("EDIT_CHARACTER call ID ---->", callId);
                socket.emit('processing-started', { call_id: callId });

                // Polling the result
                const result = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`, socket);

                // Upload updated story elements to S3 (overwrite)
                const updatedStoryUrl = await uploadJSONFileToS3(result.story_elements, storyS3Key, user?.email);

                socket.emit('processing-success', {
                    status: 'success',
                    mode,
                    message: 'Character updated and story saved successfully.',
                    story_elements: result.story_elements,
                    storyUrl: updatedStoryUrl,
                });

            } catch (error) {
                console.error("Error in edit-character flow:", error);
                socket.emit('processing-error', {
                    success: false,
                    message: error.message || 'Failed to edit character',
                });
            }
        }

    } catch (error) {
        console.error('Audio processing error:', error)
        socket.emit('processing-error', {
            success: false,
            message: error.message || 'Audio processing failed'
        })
    }
}

export const themeCharacterSocket = async (data) => {
    const {
        socket,
        mode, // 'use_likeness' or 'create_avatar'
        user,
        character_name,
        avatarFolderPath,
        calibrationImage,
        charchaImages = [], // 6 images
        characterDetails,
        character_outfit
    } = data;

    const email = user?.email;

    try {
        socket.emit('processing-status', { status: 'started', message: 'Theme character creation started' });

        // 1. Upload calibration image and charcha images to S3
        const allImages = [calibrationImage, ...charchaImages]; // 7 total
        await Promise.all(allImages.map((img, index) =>
            uploadFileToS3(img, `${avatarFolderPath}/image_${index + 1}.png`, email)
        ));

        socket.emit('processing-status', { status: 'upload-complete', message: 'Images uploaded to S3' });

        // 2. Preprocess
        const preprocessPayload = {
            images_path: `https://s3.amazonaws.com/${avatarFolderPath}`,
            character_name
        };
        const preprocessRes = await axios.post(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/submit`, preprocessPayload);
        const preprocessCallId = preprocessRes.data.call_id;

        socket.emit('processing-status', { status: 'preprocessing', call_id: preprocessCallId });

        const preprocessResult = await pollForResult(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/result/${preprocessCallId}`, socket);
        const processedPath = preprocessResult.processed_path;

        // 3. Train character
        const trainPayload = {
            processed_path: processedPath,
            character_name
        };
        const trainRes = await axios.post(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/submit`, trainPayload);
        const trainCallId = trainRes.data.call_id;

        socket.emit('processing-status', { status: 'training', call_id: trainCallId });

        const trainResult = await pollForResult(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/result/${trainCallId}`, socket);
        const loraPath = trainResult.lora_path;

        // 4. Style character
        const stylePayload = {
            lora_path: loraPath,
            character_name,
            character_outfit
        };
        const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
        const styleCallId = styleRes.data.call_id;

        socket.emit('processing-status', { status: 'styling', call_id: styleCallId });

        const styledImages = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${styleCallId}`, socket);

        // Done
        socket.emit('processing-complete', {
            success: true,
            styledImages,
            loraPath
        });

    } catch (error) {
        console.error("Error in themeCharacterSocket:", error);
        socket.emit('processing-error', {
            success: false,
            message: error.message || 'Theme character generation failed'
        });
    }
};

const sceneCharacterService = async (data) => {
    const {
        socket,
        user,
        character_name,
        media_type, // music, podcast, voiceover
        avatarFolderPath,
        scenesJsonPath,
        storyElementsJsonPath,
        characterOutfit,
        styleChoice, // 'realistic', 'animated', 'sketch'
        orientation, // 'portrait', 'square', 'landscape'
        lipsync // true or false
    } = data;

    const email = user?.email;

    try {
        // Emit socket update for the start of the process
        socket.emit('processing-status', { status: 'started', message: 'Scene character creation started' });

        // 1. Upload the images to S3
        const images = ['realistic.png', 'animated.png', 'sketch.png']; // Assuming these images are part of your assets
        await Promise.all(images.map((img, index) =>
            uploadFileToS3(img, `${avatarFolderPath}/${img}`, email)
        ));

        socket.emit('processing-status', { status: 'upload-complete', message: 'Images uploaded to S3' });

        // 2. Generate prompts by calling scene_llm_endpoint
        const scenePayload = {
            mode: "create-prompts",
            scenes_path: `https://s3.amazonaws.com/${scenesJsonPath}`,
            story_elements: `https://s3.amazonaws.com/${storyElementsJsonPath}`,
            character_name,
            media_type
        };
        const sceneRes = await axios.post(`${process.env.SCENE_LLM_ENDPOINT}/submit`, scenePayload);
        const sceneCallId = sceneRes.data.call_id;

        socket.emit('processing-status', { status: 'generating-prompts', call_id: sceneCallId });

        // Poll for result of prompt generation
        const promptsResult = await pollForResult(`${process.env.SCENE_LLM_ENDPOINT}/result/${sceneCallId}`, socket);
        const prompts = promptsResult.prompts;

        // Save the prompts as proto_prompts.json in S3 using uploadJSONFileToS3
        await uploadJSONFileToS3(prompts, `${avatarFolderPath}/proto_prompts.json`, email);

        socket.emit('processing-status', { status: 'prompts-saved', message: 'Prompts saved to S3' });

        // 3. Update character styling if the user presses "change look"
        if (characterOutfit) {
            // Update story elements (e.g., change character outfit)
            const updatedStoryElements = { ...prompts, character_outfit: characterOutfit };

            // Save the updated story elements JSON to S3
            await uploadJSONFileToS3(updatedStoryElements, `${avatarFolderPath}/story_elements.json`, email);

            // Call the style endpoint with the new character outfit
            const stylePayload = {
                lora_path: `https://s3.amazonaws.com/${avatarFolderPath}/lora/${character_name}.safetensors`,
                character_name,
                character_outfit: characterOutfit
            };
            const styleRes = await axios.post(`${process.env.STYLE_ENDPOINT}/submit`, stylePayload);
            const styleCallId = styleRes.data.call_id;

            socket.emit('processing-status', { status: 'styling', call_id: styleCallId });

            const styledImages = await pollForResult(`${process.env.STYLE_ENDPOINT}/result/${styleCallId}`, socket);

            // Return styled images based on the user's selected style
            let finalImage = '';
            if (styleChoice === 'realistic') {
                finalImage = styledImages.realistic;
            } else if (styleChoice === 'animated') {
                finalImage = styledImages.animated;
            } else if (styleChoice === 'sketch') {
                finalImage = styledImages.sketch;
            }

            // Include additional options for orientation and lipsync if necessary
            const result = {
                image: finalImage,
                orientation,
                lipsync
            };

            socket.emit('processing-complete', {
                success: true,
                result
            });
        } else {
            // If no outfit change, directly return the styled image
            const result = {
                image: promptsResult.prompts[0]?.image, // Example to show first prompt's image
                orientation,
                lipsync
            };

            socket.emit('processing-complete', {
                success: true,
                result
            });
        }

    } catch (error) {
        console.error("Error in sceneCharacterService:", error);
        socket.emit('processing-error', {
            success: false,
            message: error.message || 'Scene character generation failed'
        });
    }
};

