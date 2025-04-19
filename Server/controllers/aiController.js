import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { createS3Folder, createUserFolder, uploadFileToS3, uploadJSONFileToS3 } from "../services/s3Service.js"
import APIError, { HttpStatusCode } from '../exception/errorHandler.js'
import userTask from '../models/userTaskModel.js'
import userAudio from '../models/userAudioModel.js'
import { toStringId } from '../utils/mongo.js'
import userTaskLog from '../models/userTaskLogModel.js'
import { audioProcessingEnum, AvatarProcessModes, avtarCharacterEnum, editSceneEnum, editStoryModes, finalVideoEnum, lyricsProcessENUM, processingStatus, styleCharacterEnum, taskLogStatusENUM, taskStatusENUM, themeCharacterEnum, userTaskLogNameEnum } from '../enums/ENUMS.js'
import { updateSceneDataService, uploadCharchaImagesService } from '../services/aiServices.js'
import logger from '../utils/logger.js'


const pollForResult = async (url, socket, interval = 3000, maxAttempts = 5) => {

    for (let i = 0; i < maxAttempts; i++) {
        const res = await axios.get(url)
        const status = res.status
        if (status === 200) return res.data
        if (status === 202) {
            console.log(` Still processing...`);
            socket.emit('polling-processing-progress', { message: 'data is still processing...' });
        } else if (status === 404) {
            socket.emit('processing-error', {
                status: 'failed',
                message: 'Emotion processing failed or file not found.',
            });
            throw new Error('Emotion data not found (404)');
        } else {
            console.warn(`[${attempt}] ⚠️ Unexpected status code: ${status}`);
            socket.emit('processing-error', {
                attempt,
                status: 'unexpected',
                message: `Unexpected status code: ${status}`,
            });
            throw new Error(`Unexpected status: ${status}`);
        }
        await new Promise(resolve => setTimeout(resolve, interval))
    }
    console.log("Max attempts reached while polling")
    socket.emit('polling-processing-error', { status: 'timeout', message: 'Timeout while polling result' })
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

export const updateSceneData = async (req, res, next) => {
    try {
        const requestData = req.body;
        const requestUser = req.user;

        console.log(requestData);
        console.log(requestUser);

        const response = await updateSceneDataService(requestData, requestUser)

        console.log("response-->", response)

        return res.status(200).json({
            success: true,
            message: 'Scene data updated successfully',
            data: response
        })

    } catch (error) {
        logger.error("error in updated scene data api-->", error)
        next(error);
    }
}

export const uploadCharchaImages = async (req, res, next) => {
    try {
        const calibrationImage = req.files.calibrationImage?.[0];
        const charchaImages = req.files.charchaImages;
        const { characterName } = req.body;
        const user = req.user;
        console.log("calibrationImage", calibrationImage);
        console.log("charchaImages", charchaImages);
        console.log("characterName", characterName);

        if (!charchaImages || charchaImages.length != 7) {
            throw new APIError(
                "Validation Error",
                HttpStatusCode.BAD_REQUEST,
                true,
                "All 7 images are required"
            );
        }

        const { folderPath, uploadedUrls } = await uploadCharchaImagesService({
            calibrationImage,
            charchaImages,
            characterName,
            user
        });
        return res.status(200).json({
            success: true,
            message: 'Images uploaded sucessfully',
            data: { folderPath, uploadedUrls }
        });
    } catch (error) {
        console.log("error in uploadCharchaImages", error);
        logger.error("Error in uploadCharchaImages:", error);
        next(error);
    }
};

export const audioprocessedSocket = async (data) => {
    const { audio, groupId, socket, socketId, english_priority = false, user } = data
    const userEmail = user?.email;
    console.log("userEmail", userEmail);
    try {
        socket.emit(audioProcessingEnum.AUDIO_PROCESSING_START, { status: processingStatus.STARTED, message: 'Audio processing started' })

        // Emit that both processing tasks are starting
        socket.emit(audioProcessingEnum.EMOTION_SUBMIT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Processing emotions...' });
        socket.emit(audioProcessingEnum.TRANSCRIBER_SUBMIT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Processing transcription...' });

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

        socket.emit(audioProcessingEnum.EMOTION_SUBMIT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'Emotion submitted', data: emotionCallId });
        socket.emit(audioProcessingEnum.TRANSCRIBER_SUBMIT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'Transcriber submitted', data: transcriberCallId });

        socket.emit(audioProcessingEnum.EMOTION_RESULT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Emotion result processing started' });
        socket.emit(audioProcessingEnum.TRANSCRIBER_RESULT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Transcriber result processing started' });

        // Fire both polling tasks in parallel
        const [emotionData, transcriptData] = await Promise.all([
            pollForResult(`${process.env.PY_EMOTION_BASE_URL}/result/${emotionCallId}`, socket),
            pollForResult(`${process.env.PY_TRANSCRIBER_BASE_URL}/result/${transcriberCallId}`)
        ]);

        socket.emit(audioProcessingEnum.EMOTION_RESULT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'Emotion result processing completed' });
        socket.emit(audioProcessingEnum.EMOTION_RESULT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'Transcriber result processing completed' });

        //3.🔥 Upload to S3 in parallel
        const [emotionUrl, transcriptUrl] = await Promise.all([
            uploadJSONFileToS3(emotionData, `emotion_data-${uuid()}.json`, userEmail),
            uploadJSONFileToS3(transcriptData, `word_timestamps-${uuid()}.json`, userEmail)
        ]);

        // 3. 🔥 Scene Processing
        socket.emit(audioProcessingEnum.SCENE_SUBMIT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Scene Submit started..' })
        const sceneSubmit = await axios.post(`${process.env.PY_SCENE_BASE_URL}/submit`, {
            word_timestamps: transcriptUrl,
            emotion_data: emotionUrl,
            audio_file: audio
        })
        const sceneCallId = sceneSubmit.data.call_id
        socket.emit(audioProcessingEnum.SCENE_SUBMIT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'scene submit is completed' })

        // 4. 🔥 Scene Result Processing
        socket.emit(audioProcessingEnum.SCENE_RESULT_PROCESSING_START, { status: processingStatus.STARTED, message: 'Processing scenes...' })
        const sceneData = await pollForResult(`${process.env.PY_SCENE_BASE_URL}/result/${sceneCallId}`)
        const sceneUrl = await uploadJSONFileToS3(sceneData, "scenes-${uuid()}.json", userEmail)

        socket.emit(audioProcessingEnum.SCENE_RESULT_PROCESSING_COMPLETED, { status: processingStatus.COMPLETED, message: 'Scene result completed..' })

        //🚀 Emit that processing is complete
        socket.emit(audioProcessingEnum.AUDIO_PROCESSING_RESULT, {
            success: true,
            audio,
            emotion_url: emotionUrl,
            transcript_url: transcriptUrl,
            scene_url: sceneUrl,
            scene_data: sceneData
        })
        socket.emit(audioProcessingEnum.AUDIO_PROCESSING_END, { status: 'end', message: 'Audio processing ended' })

    } catch (error) {
        console.error('Audio processing error:', error)
        socket.emit(audioProcessingEnum.AUDIO_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'Audio processing failed'
        })
    }
}

export const lyricsProcessedSocket = async (data) => {
    const { mode, socket, socketId, user, scenes_path, story_elements, story_instructions, storyS3Key, new_story, character_name, media_type, prompts_path, prompt_index, edit_instruction, proto_key } = data;

    const email = user?.email;
    try {
        socket.emit(lyricsProcessENUM.START, { status: processingStatus.STARTED, message: 'Lyrics processing started' });

        if (mode === editStoryModes.CREATE_STORY) {
            if (!scenes_path || !mode) return socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, { status: 'error', message: 'Missing required parameters scene_path and mode' })

            socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: 'started', message: 'Lyrics processing started for create story' });

            const lyricsSubmit = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                mode,
                scenes_path
            });

            const lyricsCallId = lyricsSubmit.data.call_id;
            socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: 'lyrics-call-id', message: 'Lyrics submitted', data: lyricsCallId });

            socket.emit(lyricsProcessENUM.STORY_RESULT, { status: 'lyrics-result-processing', message: 'Lyrics result-processing', data: lyricsCallId });
            const storyData = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${lyricsCallId}`, socket);
            const storyKey = `story_elements-${uuid()}.json`
            const stroyUrl = await uploadJSONFileToS3(storyData, storyKey, email);

            socket.emit(lyricsProcessENUM.STORY_RESULT, { status: 'lyrics-complete', message: 'Lyrics processing complete' });

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_RESULT, {
                success: true,
                sceneUrl: scenes_path,
                storyUrl: stroyUrl,
                storyElements: storyData,
                storyKey
            })
        } else if (mode === editStoryModes.EDIT_STORY) {
            if (!story_instructions || !story_elements || !storyS3Key) {
                return socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    status: 'error',
                    message: 'Missing storyInstructions,storyElement storyS3Key for edit-story',
                });
            }

            socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: processingStatus.STARTED, message: 'Editing story details..' });

            try {
                const response = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                    mode,
                    scenes_path,
                    Story_elements: story_elements,
                    story_instructions
                });
                const callId = response.data.call_id;

                socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: processingStatus.COMPLETED, message: "submit completed for edit", data: callId });

                socket.emit(lyricsProcessENUM.STORY_RESULT, { status: processingStatus.STARTED, message: "lyrics story result started" });

                const result = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`);

                // 🔁 Replace the existing file in S3 using the same key
                const updatedStoryUrl = await uploadJSONFileToS3(result, storyS3Key, email);

                socket.emit(lyricsProcessENUM.STORY_RESULT, { status: processingStatus.COMPLETED, message: 'Lyrics processing complete' });

                socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_RESULT, {
                    success: true,
                    storyUrl: updatedStoryUrl,
                    storyElements: result,
                    storyKey: storyS3Key,
                    scenes_path
                })
            } catch (error) {
                console.error("Error in edit-character flow:", error);
                socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    success: false,
                    message: error.message || 'Failed to edit story',
                });
            }
        } else if (mode === editStoryModes.EDIT_CHARACTER) {

            if (!scenes_path || !story_elements || !new_story || !storyS3Key) {
                return socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    status: 'error',
                    message: 'Missing scenesPath, storyElement, newStory or sceneKey for edit-character',
                });
            }

            try {
                socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: processingStatus.STARTED, message: 'Processing Submit for edit-character' });
                // Submit the request to edit-character endpoint
                const response = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                    mode,
                    scenes_path,
                    Story_elements: story_elements,
                    new_story,
                });

                const callId = response.data.call_id;
                socket.emit(lyricsProcessENUM.STORY_SUBMIT, { status: processingStatus.COMPLETED, message: 'completed Submit for edit-character', data: callId });

                socket.emit(lyricsProcessENUM.STORY_RESULT, { status: processingStatus.STARTED, message: 'Processing Submit for edit-character' });

                // Polling the result
                const result = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`, socket);

                // Upload updated story elements to S3 (overwrite)
                const updatedStoryUrl = await uploadJSONFileToS3(result.story_elements, storyS3Key, user?.email);

                socket.emit(lyricsProcessENUM.STORY_RESULT, { status: processingStatus.COMPLETED, message: 'edit character processing complete' });

                socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_RESULT, {
                    status: 'success',
                    message: 'Character updated and story saved successfully.',
                    storyElements: result,
                    storyUrl: updatedStoryUrl,
                });
            } catch (error) {
                console.error("Error in edit-character flow:", error);
                socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    success: false,
                    message: error.message || 'Failed to edit character',
                });
            }
        } else if (mode === editStoryModes.CREATE_PROMPT) {
            if (!scenes_path || !story_elements || !character_name || !media_type) {
                return socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    status: "error",
                    message: 'Missing scenesPath, storyElement, characterName or mediaType for create-prompt',
                });
            }
            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.STARTED, message: 'Processing Submit for create-prompt' });
            const promptPayload = {
                mode: editStoryModes.CREATE_PROMPT,
                scenes_path,
                story_elements,
                character_name,
                media_type
            };

            const promptRes = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, promptPayload);
            const callId = promptRes.data.call_id;

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'Processing Submit for create-prompt' });

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.STARTED, message: 'Processing result for create-prompt' });
            const promptResult = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`, socket);
            const prompts = promptResult.prompts;

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'Processing result for create-prompt' });

            const protoPromptsKey = `proto_prompts-${uuid()}.json`;
            const protoPromtUrl = await uploadJSONFileToS3(prompts, protoPromptsKey, email);

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'uploded prompts result for create-prompt' });

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_RESULT, {
                success: true,
                prompt_data: prompts,
                proto_key: protoPromptsKey,
                proto_url: protoPromtUrl,
            });
        } else if (mode === editStoryModes.EDIT_PROMPT) {
            if (!prompts_path || !prompt_index || !edit_instruction || !proto_key) {
                return socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                    status: 'error',
                    message: 'Missing prompts_path, prompt_index or edit_instruction, proto_key,for edit-prompt',
                });
            }
            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.STARTED, message: 'Processing Submit for edit-prompt' });
            const editPromptPayload = {
                mode: editStoryModes.EDIT_PROMPT,
                prompts_path,
                prompt_index,
                edit_instruction
            };

            const sceneResponse = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, editPromptPayload);

            const sceneCallId = sceneResponse.data.call_id;

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'Processing Submit for edit-prompt' });

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.STARTED, message: 'Processing result for edit-prompt' });

            const editedPromptResp = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${sceneCallId}`);
            const updatedPrompts = editedPromptResp.prompts;

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'Processing result for edit-prompt' });

            const proto_url = await uploadJSONFileToS3(updatedPrompts, proto_key, email);

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING, { status: processingStatus.COMPLETED, message: 'uploded prompts result for edit-prompt' });

            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_RESULT, {
                success: true,
                prompt_data: updatedPrompts,
                proto_key,
                proto_url
            })
        }else {
            socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
                success: false,
                message: `mode can be only one of: ${Object.values(editStoryModes).join(', ')}`
            });
        }
        socket.emit(lyricsProcessENUM.END, { status: 'completed', message: 'Lyrics processing ended' });
    } catch (error) {
        console.error('lyrics processing error:', error)
        socket.emit(lyricsProcessENUM.LYRICS_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'Lyrics processing failed'
        })
    }
}

export const themeCharacterSocket = async (data) => {
    const {
        socket,
        user,
        character_name,
        images_path,
        // calibrationImage,
        // charchaImages = [],
        character_outfit
    } = data;

    const email = user?.email;

    try {
        socket.emit(themeCharacterEnum.START, { status: 'started', message: 'Theme character creation started' });

        // const allImages = [calibrationImage, ...charchaImages];

        // console.log("allImages", allImages);

        // const avtarFolderName = "charchaImages";
        // await Promise.all(allImages.map((img, index) => {
        //     const fileName = `image${index + 1}.png`;
        //     return uploadBase64FileToS3(img, avtarFolderName, email, fileName);
        // }));


        if (!images_path || !character_name) {
            return socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING_ERROR, {
                status: 'error',
                message: 'image_path, character_name are required parameters',
            });
        }

        // 2. Preprocess
        const preprocessPayload = {
            images_path,
            character_name
        };
        const preprocessRes = await axios.post(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/submit`, preprocessPayload);
        const preprocessCallId = preprocessRes.data.call_id;

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'preprocessing', call_id: preprocessCallId });

        const preprocessResult = await pollForResult(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/result/${preprocessCallId}`, socket);
        const processedPath = preprocessResult.processed_path;

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: "result completed", data: processedPath });

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'training character started', message: 'training character started' });

        // 3. Train character
        const trainPayload = {
            processed_path: processedPath,
            character_name
        };

        const trainRes = await axios.post(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/submit`, trainPayload);
        const trainCallId = trainRes.data.call_id;


        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'training', call_id: trainCallId });

        const trainResult = await pollForResult(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/result/${trainCallId}`, socket);
        const loraPath = trainResult.lora_path;

        // 4. Style character
        const stylePayload = {
            lora_path: loraPath,
            character_name,
            character_outfit
        };

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'style started', message: 'style started' });

        const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
        const styleCallId = styleRes.data.call_id;

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'styling call Id', call_id: styleCallId });

        const styleImages = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${styleCallId}`, socket);

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING, { status: 'style completed ', message: 'style completed' });

        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING_RESULT, {
            success: true,
            styleImages,
            lora_path: loraPath
        });

        socket.emit(themeCharacterEnum.END, { status: processingStatus.COMPLETED, message: 'theme processing completed' });

    } catch (error) {
        console.error("Error in themeCharacterSocket:", error);
        socket.emit(themeCharacterEnum.THEME_CHARACTER_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'Theme character generation failed'
        });
    }
};

export const avatarServiceSocket = async (data) => {
    const {
        socket,
        user,
        mode,
        character_name,
        character_details,
        character_outfit,
    } = data;

    const email = user?.email;
    let avatarImages = [];

    try {
        socket.emit(avtarCharacterEnum.START, { status: processingStatus.STARTED, message: 'Avatar processing started' });

        const folderName = "AVATAR";
        const folderPath = await createS3Folder(email, folderName);

        socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, message: 'Folder Created in Bucket' });

        if (!character_details || !mode) {
            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING_ERROR, {
                success: false,
                message: 'character_details , mode are required parameters'
            })
            return;
        }

        if (mode === AvatarProcessModes.CREATE) {
            const avatarPayload = {
                mode: AvatarProcessModes.CREATE,
                images_path: folderPath,
                character_details
            };

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Avatar submit processing started' });

            const avatarRes = await axios.post(`${process.env.PY_AVTAR_BASE_URL}/submit`, avatarPayload);
            const callId = avatarRes.data.call_id;

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, call_id: callId });

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Avatar result processing started' });
            const result = await pollForResult(`${process.env.PY_AVTAR_BASE_URL}/result/${callId}`, socket);
            avatarImages = [
                result.image_1_path,
                result.image_2_path,
                result.image_3_path
            ];
            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, message: 'Avatar submit processing COMPLETED' });

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING_RESULT, {
                success: true,
                avatarImages,
                avtarfolderPath: folderPath
            });
        }

        if (mode === AvatarProcessModes.UPSCALE) {

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Upscaling avatar images processing' });

            const upscalePayload = {
                mode: AvatarProcessModes.UPSCALE,
                images_path: folderPath
            };

            const upscaleRes = await axios.post(`${process.env.PY_AVTAR_BASE_URL}/submit`, upscalePayload);
            const upscaleCallId = upscaleRes.data.call_id;

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, data: upscaleCallId });

            const upscaleResult = await pollForResult(`${process.env.PY_AVTAR_BASE_URL}/result/${upscaleCallId}`, socket);
            const upscaledPath = upscaleResult.upscaled_path;

            // Step 2: Preprocess
            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Preprocessing avatar images' });

            const preprocessPayload = {
                images_path: upscaledPath,
                character_name
            };

            const preprocessRes = await axios.post(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/submit`, preprocessPayload);
            const preprocessCallId = preprocessRes.data.call_id;

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, data: preprocessCallId });

            const preprocessResult = await pollForResult(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/result/${preprocessCallId}`, socket);
            const processedPath = preprocessResult.processed_path;

            // Step 3: Train
            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Training character model' });

            const trainPayload = {
                processed_path: processedPath,
                character_name
            };

            const trainRes = await axios.post(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/submit`, trainPayload);
            const trainCallId = trainRes.data.call_id;

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, data: trainCallId });

            const trainResult = await pollForResult(`${process.env.PY_TRAIN_CHARACTER_BASE_URL}/result/${trainCallId}`, socket);
            const loraPath = trainResult.lora_path;

            // Step 4: Style
            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Applying styles to character' });

            const stylePayload = {
                lora_path: loraPath,
                character_name,
                character_outfit
            };

            const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
            const styleCallId = styleRes.data.call_id;

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, data: styleCallId });

            const styleResult = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${styleCallId}`, socket);

            socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING_RESULT, {
                success: true,
                styledImages: styleResult,
                loraPath,
                avatarImages
            });

            socket.emit(avtarCharacterEnum.END, { status: processingStatus.COMPLETED, message: 'Avatar processing completed' });
        }
    } catch (error) {
        console.error("Error in avatarService:", error);
        socket.emit(avtarCharacterEnum.AVATAR_CHARACTER_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'Avatar processing failed'
        });
    }
};

export const selectStyleSocket = async (data) => {
    const {
        socket,
        character_name,
        lora_path,
        character_outfit
    } = data;

    try {
        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Style processing started' });
        if (!lora_path || !character_name || !character_outfit) {
            socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING_ERROR, {
                success: false,
                message: 'lora_path, character_name, character_outfit are required parameters'
            })
            return;
        }
        const stylePayload = {
            lora_path,
            character_name,
            character_outfit
        };
        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Style submit processing started' });

        const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
        const callId = styleRes.data.call_id;

        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING, { status: processingStatus.COMPLETED, data: callId });

        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING, { status: processingStatus.STARTED, message: 'Style result processing started' });

        const result = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${callId}`, socket);

        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING_RESULT, {
            success: true,
            lora_path,
            character_name,
            character_outfit,
            styledImages: result
        });

    } catch (error) {
        console.error("Error in selectStyleService:", error);
        socket.emit(styleCharacterEnum.STYLE_CHARACTER_PROCESSING_ERROR, {
            success: false,
            message: error.message || "Style processing failed"
        });
    }
};

export const editSceneSocket = async (data) => {
    const {
        proto_prompts,
        character_lora_path,
        character_name,
        character_outfit,
        prompt_indices,
        style,
        id_image,
        orientation,
        socket,
        replacement_word,
        socketId,
        user
    } = data;
    try {
        const email = user?.email;

        if (!proto_prompts || !character_lora_path || !character_name || !character_outfit || !prompt_indices || !style || !id_image || !orientation) {
            socket.emit(editSceneEnum.EDIT_SCENE_PROCESSING_ERROR, {
                success: false,
                message: 'proto_prompts,character_lora_path,character_name,character_outfit,prompt_indices,style,id_image,orientation required fields must be provided'
            });
        }

        const editScenePayload = {
            proto_prompts,
            character_lora_path,
            character_name,
            character_outfit,
            prompt_indices,
            style,
            id_image,
            orientation,
        };

        if (replacement_word) {
            editScenePayload.replacement_word = replacement_word;
        }

        const fluxResponse = await axios.post(`${process.env.PY_FLUX_PROMT_BASE_URL}/submit`, editScenePayload);
        const fluxCallId = fluxResponse.data.call_id;

        const fluxResult = await pollForResult(`${process.env.PY_FLUX_PROMT_BASE_URL}/result/${fluxCallId}`);
        return fluxResult;

    } catch (error) {
        console.error('Error in editScene service:', error);
        socket.emit(editSceneEnum.EDIT_SCENE_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'Edit scene processing failed'
        });
    }
};

export const generateFinalVideoSocket = async (data) => {
    const {
        proto_prompts,
        character_name,
        style,
        orientation,
        image_folder_path,
        replacement_word,
        socket,
        socketId,
        user
    } = data;

    const email = user?.email;

    try {

        if (!proto_prompts || !character_name || !style || !orientation || !image_folder_path || !replacement_word) {
            socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_ERROR, {
                success: false,
                message: "proto_prompts, character_name, style,orientation, image_folder_path,replacement_word is required"
            })
            return;
        }

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video processing started' });

        const i2vSubmitRes = await axios.post(`${process.env.PY_I2V_BASE_URL}/submit`, {
            proto_prompts,
            character_name,
            style,
            orientation,
            image_folder_path,
            replacement_word,
        });

        const i2vCallId = i2vSubmitRes.data.call_id;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, data: i2vCallId });

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video result processing started' });

        const i2vResult = await pollForResult(`${process.env.PY_I2V_BASE_URL}/result/${i2vCallId}`, socket);

        const video_folder_path = i2vResult.video_folder_path;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, message: 'Final video result processing completed' });


        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video cut submit processing started' });

        const vidCutSubmitRes = await axios.post(`${process.env.PY_VIDEO_CUT_BASE_URL}/submit`, {
            proto_prompts,
            video_folder_path,
        });

        const vidCutCallId = vidCutSubmitRes.data.call_id;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, data: vidCutCallId });

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video cut result processing started' });

        const vidCutResult = await pollForResult(`${process.env.PY_VIDEO_CUT_BASE_URL}/result/${vidCutCallId}`, socket);

        console.log(vidCutResult)
        const final_video_path = vidCutResult.final_video_path;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, message: "video cutting result completed" })

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_RESULT, {
            success: true,
            final_video_path
        });

        return { final_video_folder };
    } catch (error) {
        console.error('Error generating final video:', error);
        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_ERROR, {
            success: false,
            message: error.message || 'final video processing failed'
        });
        throw error;
    }
};

export const generateFinalVideoWithPromptSocket = async (data) => {
    const {
        proto_prompts,
        character_name,
        style,
        orientation,
        image_folder_path,
        prompt,
        replacement_word,
        socket,
        socketId,
        user
    } = data;

    const email = user?.email;
    try {
        if (!proto_prompts || !character_name || !style || !orientation || !image_folder_path || !prompt || !replacement_word) {
            socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_ERROR, {
                success: false,
                message: "proto_prompts, character_name, style,orientation, image_folder_path, prompt,replacement_word is required"
            })
            return;
        }

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: "final video started by prompt" })
        const i2vSubmitRes = await axios.post(`${process.env.PY_I2V_BASE_URL}/submit`, {
            proto_prompts,
            character_name,
            style,
            orientation,
            image_folder_path,
            prompt,
            replacement_word,
        });

        const i2vCallId = i2vSubmitRes.data.call_id;


        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, data: i2vCallId });

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video result processing started' });

        const i2vResult = await pollForResult(`${process.env.PY_I2V_BASE_URL}/result/${i2vCallId}`, socket);

        const video_folder_path = i2vResult.video_folder_path;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, message: 'Final video result processing completed' });

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.STARTED, message: 'Final video cut submit processing started' });

        const vidCutSubmitRes = await axios.post(`${process.env.PY_VIDEO_CUT_BASE_URL}/submit`, {
            proto_prompts,
            video_folder_path,
        });

        const vidCutCallId = vidCutSubmitRes.data.call_id;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, data: vidCutCallId })

        const vidCutResult = await pollForResult(`${process.env.PY_VIDEO_CUT_BASE_URL}/result/${vidCutCallId}`, socket);

        const final_video_path = vidCutResult.final_video_path;

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING, { status: processingStatus.COMPLETED, message: "video cutting result completed" })

        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_RESULT, {
            success: true,
            final_video_path,
        });
        return { final_video_path };
    } catch (error) {
        console.error('Error generating video with prompt:', error);
        socket.emit(finalVideoEnum.FINAL_VIDEO_PROCESSING_ERROR,
            {
                success: false,
                message: error.message || "error in final video edit"
            }
        );
        throw error;
    }
};
