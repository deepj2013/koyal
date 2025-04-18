import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { createS3Folder, createUserFolder, uploadFileToS3, uploadJSONFileToS3 } from "../services/s3Service.js"
import APIError, { HttpStatusCode } from '../exception/errorHandler.js'
import userTask from '../models/userTaskModel.js'
import userAudio from '../models/userAudioModel.js'
import { toStringId } from '../utils/mongo.js'
import userTaskLog from '../models/userTaskLogModel.js'
import { AvatarProcessModes, editStoryModes, taskLogStatusENUM, taskStatusENUM, userTaskLogNameEnum } from '../enums/ENUMS.js'
import { updateSceneDataService } from '../services/aiServices.js'
import logger from '../utils/logger.js'


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

const pollForResultWithSocket = async (url, socket, eventName) => {
    const maxRetries = 60;
    const delay = 5000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axios.get(url);
            if (response.data && Object.keys(response.data).length > 0) {
                socket.emit(eventName, { status: 'completed', data: response.data });
                return response.data;
            }
        } catch (err) {
            console.warn(`Poll attempt ${i + 1} failed for ${url}`);
        }

        socket.emit(eventName, { status: 'waiting', attempt: i + 1 });
        await new Promise(res => setTimeout(res, delay));
    }

    throw new Error(`Polling timed out for: ${url}`);
};

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
    const { mode, socket, socketId, user, scenes_path, story_elements, story_instructions, storyS3Key, new_story } = data;

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
            if (!story_instructions || !story_elements || !storyS3Key) {
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
                const response = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
                    mode,
                    scenes_path,
                    Story_elements: story_elements,
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
            if (!scenes_path || !story_elements || !new_story || !storyS3Key) {
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
                    Story_elements: story_elements,
                    new_story,
                });

                const callId = response.data.call_id;
                console.log("EDIT_CHARACTER call ID ---->", callId);
                socket.emit('processing-status', { call_id: callId });

                // Polling the result
                const result = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`, socket);

                // Upload updated story elements to S3 (overwrite)
                const updatedStoryUrl = await uploadJSONFileToS3(result.story_elements, storyS3Key, user?.email);

                socket.emit('processing-status', { status: 'edit-character-complete', message: 'edit character processing complete' });

                socket.emit('processing-complete', {
                    status: 'success',
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
        } else {
            socket.emit('processing-error', {
                success: false,
                message: `mode can be only one of: ${Object.values(editStoryModes).join(', ')}`
            });
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
        user,
        character_name,
        avatarFolderPath,
        calibrationImage,
        charchaImages = [],
        character_outfit
    } = data;

    const email = user?.email;

    try {
        socket.emit('processing-status', { status: 'started', message: 'Theme character creation started' });

        const allImages = [calibrationImage, ...charchaImages];

        const avtarFolderName = "charchaImages";
        await Promise.all(allImages.map((img, index) => {
            const fileName = `image${index + 1}.png`;
            return uploadFileToS3(img, avtarFolderName, email, fileName);
        }));

        socket.emit('processing-status', { status: 'upload-complete', message: 'Images uploaded to S3' });

        // 2. Preprocess
        const preprocessPayload = {
            images_path: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${avatarFolderPath}/`,
            character_name
        };
        const preprocessRes = await axios.post(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/submit`, preprocessPayload);
        const preprocessCallId = preprocessRes.data.call_id;

        console.log("id---->", preprocessCallId)
        socket.emit('processing-status', { status: 'preprocessing', call_id: preprocessCallId });

        const preprocessResult = await pollForResult(`${process.env.PY_CHARACTER_PROGRESS_BASE_URL}/result/${preprocessCallId}`, socket);
        const processedPath = preprocessResult.processed_path;

        socket.emit('processing-status', { status: "result completed", processedPath });

        socket.emit('processing-status', { status: 'training character started', message: 'training character started' });

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

        socket.emit('processing-status', { status: 'style started', message: 'style started' });

        const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
        const styleCallId = styleRes.data.call_id;

        socket.emit('processing-status', { status: 'styling call Id', call_id: styleCallId });

        const styledImages = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${styleCallId}`, socket);
        // here we get three iamges realastic ,animated, sketch..

        socket.emit('processing-status', { status: 'style completed ', message: 'style completed' });
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

export const avatarServiceSocket = async (data) => {
    const {
        socket,
        user,
        mode,
        character_name,
        avatarFolderPath,
        character_details,
        character_outfit
    } = data;

    const email = user?.email;
    let avatarImages = [];

    try {
        socket.emit('avatar-status', { status: 'started', message: 'Avatar processing started' });

        const folderName = "AVATAR";
        const folderPath = await createS3Folder(folderName, email); // Ensure it returns a usable S3 path
        const s3BasePath = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folderPath}/`;

        if (mode === AvatarProcessModes.CREATE) {
            const avatarPayload = {
                mode: AvatarProcessModes.CREATE,
                images_path: s3BasePath,
                character_details
            };

            const avatarRes = await axios.post(`${process.env.AVATAR_ENDPOINT_URL}/submit`, avatarPayload);
            const callId = avatarRes.data.call_id;

            socket.emit('avatar-status', { status: 'generating-avatars', call_id: callId });

            const result = await pollForResult(`${process.env.AVATAR_ENDPOINT_URL}/result/${callId}`, socket);
            avatarImages = [
                result.image_1_path,
                result.image_2_path,
                result.image_3_path
            ];

            socket.emit('avatar-status', {
                status: 'avatars-generated',
                message: 'Avatar images generated',
                avatarImages
            });

            return {
                success: true,
                avatarImages
            };
        }

        if (mode === AvatarProcessModes.UPSCALE) {
            // Step 1: Upscale
            socket.emit('avatar-status', { status: 'upscaling', message: 'Upscaling avatar images' });

            const upscalePayload = {
                mode: AvatarProcessModes.UPSCALE,
                images_path: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${avatarFolderPath}/`
            };

            const upscaleRes = await axios.post(`${process.env.AVATAR_ENDPOINT_URL}/submit`, upscalePayload);
            const upscaleCallId = upscaleRes.data.call_id;

            socket.emit('avatar-status', { status: 'upscaling', call_id: upscaleCallId });

            const upscaleResult = await pollForResult(`${process.env.AVATAR_ENDPOINT_URL}/result/${upscaleCallId}`, socket);
            const upscaledPath = upscaleResult.upscaled_path;

            // Step 2: Preprocess
            socket.emit('avatar-status', { status: 'preprocessing', message: 'Preprocessing avatar images' });

            const preprocessPayload = {
                images_path: upscaledPath,
                character_name
            };

            const preprocessRes = await axios.post(`${process.env.CHARACTER_PREPROCESS_ENDPOINT_URL}/submit`, preprocessPayload);
            const preprocessCallId = preprocessRes.data.call_id;

            socket.emit('avatar-status', { status: 'preprocessing', call_id: preprocessCallId });

            const preprocessResult = await pollForResult(`${process.env.CHARACTER_PREPROCESS_ENDPOINT_URL}/result/${preprocessCallId}`, socket);
            const processedPath = preprocessResult.processed_path;

            // Step 3: Train
            socket.emit('avatar-status', { status: 'training', message: 'Training character model' });

            const trainPayload = {
                processed_path: processedPath,
                character_name
            };

            const trainRes = await axios.post(`${process.env.TRAIN_CHARACTER_ENDPOINT_URL}/submit`, trainPayload);
            const trainCallId = trainRes.data.call_id;

            socket.emit('avatar-status', { status: 'training', call_id: trainCallId });

            const trainResult = await pollForResult(`${process.env.TRAIN_CHARACTER_ENDPOINT_URL}/result/${trainCallId}`, socket);
            const loraPath = trainResult.lora_path;

            // Step 4: Style
            socket.emit('avatar-status', { status: 'styling', message: 'Applying styles to character' });

            const stylePayload = {
                lora_path: loraPath,
                character_name,
                character_outfit
            };

            const styleRes = await axios.post(`${process.env.STYLE_ENDPOINT_URL}/submit`, stylePayload);
            const styleCallId = styleRes.data.call_id;

            socket.emit('avatar-status', { status: 'styling', call_id: styleCallId });

            const styleResult = await pollForResult(`${process.env.STYLE_ENDPOINT_URL}/result/${styleCallId}`, socket);

            socket.emit('avatar-complete', {
                success: true,
                styledImages: styleResult,
                loraPath,
                avatarImages
            });

            return {
                success: true,
                styledImages: styleResult,
                loraPath,
                avatarImages
            };
        }

        throw new Error(`Invalid mode: ${mode}`);
    } catch (error) {
        console.error("Error in avatarService:", error);
        socket.emit('avatar-error', {
            success: false,
            message: error.message || 'Avatar processing failed'
        });
        throw error;
    }
};

export const selectStyleSocket = async (data) => {
    const {
        socket,
        characterName,
        loraPath,
        mediaType,
        scenesPath,
        storyElementsPath,
        styleImageFolderPath,
        newCharacterOutfit,
        isLookUpdated = false
    } = data;

    try {
        const s3BaseUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

        // Load 3 images from S3
        const styledImages = {
            realistic: `${s3BaseUrl}/${styleImageFolderPath}/realistic.png`,
            animated: `${s3BaseUrl}/${styleImageFolderPath}/animated.png`,
            sketch: `${s3BaseUrl}/${styleImageFolderPath}/sketch.png`
        };

        socket.emit("style-images-loaded", {
            message: "Styled images loaded successfully",
            styledImages
        });

        // If user updates look (new character outfit), re-style
        if (isLookUpdated && newCharacterOutfit) {
            socket.emit("style-status", { status: "restyling", message: "Updating character look..." });

            const stylePayload = {
                lora_path: loraPath,
                character_name: characterName,
                character_outfit: newCharacterOutfit
            };

            const styleRes = await axios.post(`${process.env.PY_STYLE_BASE_URL}/submit`, stylePayload);
            const callId = styleRes.data.call_id;

            const result = await pollForResult(`${process.env.PY_STYLE_BASE_URL}/result/${callId}`, socket);
            styledImages.realistic = result.realistic;
            styledImages.animated = result.animated;
            styledImages.sketch = result.sketch;

            socket.emit("style-restyled", {
                message: "Look updated successfully",
                styledImages
            });
        }

        // Start prompt generation in background
        socket.emit("prompt-status", { status: "prompting", message: "Generating story prompts..." });

        const promptPayload = {
            mode: "create-prompts",
            scenes_path: scenesPath,
            story_elements: storyElementsPath,
            character_name: characterName,
            media_type: mediaType
        };

        const promptRes = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, promptPayload);
        const callId = promptRes.data.call_id;

        const promptResult = await pollForResult(`${process.env.PY_SCENE_LLM_BASE_URL}/result/${callId}`, socket);
        const prompts = promptResult.prompts;

        const protoPromptsKey = `${styleImageFolderPath}/proto_prompts.json`;
        await uploadToS3(JSON.stringify(prompts), protoPromptsKey);

        socket.emit("prompt-complete", {
            message: "Prompts generated and saved",
            protoPromptsKey,
            prompts
        });

        return {
            success: true,
            styledImages,
            prompts,
            protoPromptsPath: `${s3BaseUrl}/${protoPromptsKey}`
        };
    } catch (error) {
        console.error("Error in selectStyleService:", error);
        socket.emit("style-error", {
            success: false,
            message: error.message || "Style processing failed"
        });
        throw error;
    }
};

export const editSceneSocket = async (data) => {
    const {
        protoPromptsUrl,
        characterName,
        characterOutfit,
        loraPath,
        promptIndex,
        style,
        orientation,
        idImageUrl,
        mode,
        editInstruction,
        replacementWord = null,
        socket,
        socketId,
        user
    } = data;
    try {
        const email = user?.email;

        // Step 1: Edit the Prompt using scene_llm_endpoint
        const sceneResponse = await axios.post(`${process.env.PY_SCENE_LLM_BASE_URL}/submit`, {
            mode: mode || 'edit-prompt',
            prompts_path: protoPromptsUrl,
            prompt_index: promptIndex,
            edit_instruction: editInstruction,
        });

        const { call_id: sceneCallId } = sceneResponse.data;

        // Polling scene_llm result
        const editedPromptResp = await pollForResult(`${process.env.PY_FLUX_PROMT_BASE_URL}/result/${sceneCallId}`);
        const updatedPrompts = editedPromptResp.prompts;

        // Step 2: Upload updated proto_prompts to S3

        const proto_key = `proto_prompt-${uuid()}.json`
        const updatedPromptS3Url = await uploadJSONFileToS3(updatedPrompts, proto_key, email);

        // Step 3: Call flux_prompts_endpoint to regenerate image
        const fluxRequest = {
            proto_prompts: updatedPromptS3Url,
            character_lora_path: loraPath,
            character_name: characterName,
            character_outfit: characterOutfit,
            prompt_indices: [promptIndex],
            style,
            id_image: idImageUrl,
            orientation,
        };

        if (replacementWord) {
            fluxRequest.replacement_word = replacementWord;
        }

        const fluxResponse = await axios.post(`${process.env.PY_FLUX_PROMT_BASE_URL}/submit`, fluxRequest);
        const { call_id: fluxCallId } = fluxResponse.data;

        // Polling flux result
        const fluxResult = await pollForResult(`${process.env.PY_FLUX_PROMT_BASE_URL}/result/${fluxCallId}`);
        return fluxResult;

    } catch (error) {
        console.error('Error in editScene service:', error);
        throw error;
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

    try {
        // Step 1: Call i2v submit
        socket.emit('i2v_status', { status: 'submitting' });

        const i2vSubmitRes = await axios.post(`${process.env.PY_I2V_BASE_URL}/submit`, {
            proto_prompts,
            character_name,
            style,
            orientation,
            image_folder_path,
            replacement_word,
        });

        const i2vCallId = i2vSubmitRes.data.call_id;
        socket.emit('i2v_status', { status: 'submitted', call_id: i2vCallId });

        // Step 2: Poll for i2v result
        const i2vResult = await pollForResultWithSocket(
            `${process.env.PY_I2V_BASE_URL}/result/${i2vCallId}`,
            socket,
            'i2v_result'
        );

        const video_folder_path = i2vResult.video_folder_path;

        // Step 3: Call video cut submit
        socket.emit('vidcut_status', { status: 'submitting' });

        const vidCutSubmitRes = await axios.post(`${process.env.PY_VIDEO_CUT_BASE_URL}/submit`, {
            proto_prompts,
            video_folder_path,
        });

        const vidCutCallId = vidCutSubmitRes.data.call_id;
        socket.emit('vidcut_status', { status: 'submitted', call_id: vidCutCallId });

        // Step 4: Poll for vidcut result
        const vidCutResult = await pollForResultWithSocket(
            `${process.env.PY_VIDEO_CUT_BASE_URL}/result/${vidCutCallId}`,
            socket,
            'vidcut_result'
        );

        const final_video_folder = vidCutResult.final_video_folder;

        // Final result
        socket.emit('final_video_done', {
            message: 'Final video folder ready.',
            final_video_folder,
        });

        return { final_video_folder };
    } catch (err) {
        console.error('Error generating final video:', err);
        socket.emit('final_video_error', { error: err.message || 'Unexpected error occurred.' });
        throw err;
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

    try {
        // Step 1: i2v Submit
        socket.emit('i2v_status', { status: 'submitting', prompt });

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
        socket.emit('i2v_status', { status: 'submitted', call_id: i2vCallId });

        // Step 2: i2v Polling
        const i2vResult = await pollForResultWithSocket(
            `${process.env.PY_I2V_BASE_URL}/result/${i2vCallId}`,
            socket,
            'i2v_result'
        );

        const video_folder_path = i2vResult.video_folder_path;

        // Step 3: vid_cut Submit
        socket.emit('vidcut_status', { status: 'submitting' });

        const vidCutSubmitRes = await axios.post(`${process.env.PY_VIDEO_CUT_BASE_URL}/submit`, {
            proto_prompts,
            video_folder_path,
        });

        const vidCutCallId = vidCutSubmitRes.data.call_id;
        socket.emit('vidcut_status', { status: 'submitted', call_id: vidCutCallId });

        // Step 4: vid_cut Polling
        const vidCutResult = await pollForResultWithSocket(
            `${process.env.PY_VIDEO_CUT_BASE_URL}/result/${vidCutCallId}`,
            socket,
            'vidcut_result'
        );

        const final_video_path = vidCutResult.final_video_path;

        // Final Output
        socket.emit('final_video_done', {
            message: 'Final video ready.',
            final_video_path,
        });

        return { final_video_path };
    } catch (err) {
        console.error('Error generating video with prompt:', err);
        socket.emit('final_video_error', { error: err.message || 'Something went wrong' });
        throw err;
    }
};
