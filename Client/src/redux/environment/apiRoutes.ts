
// External API
// export const ApiRoutes = {
//   WaitingList: "api/admin/getWaitingList",
//   EmotionEndpoint: "https://koyal-dev--emotion-endpoint-fastapi-app-dev.modal.run/submit",
//   TranscriberEndpoint: "https://koyal-dev--transcriber-endpoint-fastapi-app-dev.modal.run/submit",
//   EmotionResultEndpoint: "https://koyal-dev--emotion-endpoint-fastapi-app-dev.modal.run/result",
//   TranscriberResultEndpoint: "https://koyal-dev--transcriber-endpoint-fastapi-app-dev.modal.run/result",
//   SceneEndpoint: "https://koyal-dev--scene-gen-endpoint-fastapi-app-dev.modal.run/submit",
//   SceneResultEndpoint: "https://koyal-dev--scene-gen-endpoint-fastapi-app-dev.modal.run/result",
//   SceneLLMEndpoint: "/scene_llm_endpoint/submit",
//   StoryElementEndpoint: "scene_llm_endpoint/result",
//   PreProcessCharacter: "character_preprocess_endpoint/submit",
//   ProcessedCharResult: "character_preprocess_endpoint/result",
//   TrainCharacter: "train_character_endpoint/submit",
//   GetTrainedCharacter: "train_character_endpoint/result",
//   SubmitStyle: "style_endpoint/submit",
//   GetStyleEndpoint: "/style_endpoint/result",
//   ProcessAvatar: "avatar_endpoint/submit",
//   GetProcessedAvatar: "avatar_endpoint/result",
//   ProcessFluxPrompts: "flux_prompts_endpoint/submit",
//   GetFluxPrompts: "flux_prompts_endpoint/result",
//   ProcessVideo: "i2v_endpoint/submit",
//   GetProcessedVideo: "i2v_endpoint/result",
//   ProcessFinalVideo: "vid_cut_endpoint/submit",
//   GetFinalVideo: "vid_cut_endpoint/result",
// } as const;

// Dummy API
export const ApiRoutes = {
  WaitingList: "api/admin/getWaitingList",
  EmotionEndpoint: "http://localhost:5001/emotion_endpoint/submit",
  TranscriberEndpoint: "http://localhost:5001/transcriber_endpoint/submit",
  EmotionResultEndpoint: "http://localhost:5001/emotion_endpoint/result",
  TranscriberResultEndpoint: "http://localhost:5001/transcriber_endpoint/result",
  SceneEndpoint: "http://localhost:5001/scene_endpoint/submit",
  SceneResultEndpoint: "http://localhost:5001/scene_endpoint/result",
  SceneLLMEndpoint: "/scene_llm_endpoint/submit",
  StoryElementEndpoint: "scene_llm_endpoint/result",
  PreProcessCharacter: "character_preprocess_endpoint/submit",
  ProcessedCharResult: "character_preprocess_endpoint/result",
  TrainCharacter: "train_character_endpoint/submit",
  GetTrainedCharacter: "train_character_endpoint/result",
  SubmitStyle: "style_endpoint/submit",
  GetStyleEndpoint: "/style_endpoint/result",
  ProcessAvatar: "avatar_endpoint/submit",
  GetProcessedAvatar: "avatar_endpoint/result",
  ProcessFluxPrompts: "flux_prompts_endpoint/submit",
  GetFluxPrompts: "flux_prompts_endpoint/result",
  ProcessVideo: "i2v_endpoint/submit",
  GetProcessedVideo: "i2v_endpoint/result",
  ProcessFinalVideo: "vid_cut_endpoint/submit",
  GetFinalVideo: "vid_cut_endpoint/result",
} as const;

export const CollectionApiRoutes = {
  BulkUploadAudio: "api/user/uploads/bulk-upload",
  BulkUploadAudioDetails: "api/user/task/update-bulk-audio-details",
  GetAudioDetails: "api/user/task/get-bulk-audio-details",
  EditAudioDetails: "api/user/task/update-audio-details",
  AddNewAudio: "api/user/task/add-audio-task",
} as const;

export const AdminApiRoutes = {
  CreateUser: "api/user/createUser",
  AdminLogin: "api/admin/login",
} as const;

export const AuthApiRoutes = {
  UserLogin: "api/user/userLogin",
} as const;