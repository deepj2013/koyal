export const ApiRoutes = {
  WaitingList: "api/admin/getWaitingList",
  EmotionEndpoint: "/emotion_endpoint/submit",
  TranscriberEndpoint: "/transcriber_endpoint/submit",
  EmotionResultEndpoint: "/emotion_endpoint/result",
  TranscriberResultEndpoint: "/transcriber_endpoint/result",
  SceneEndpoint: "/scene_endpoint/submit",
  SceneResultEndpoint: "/scene_endpoint/result",
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

export const AdminApiRoutes = {
  CreateUser: "api/user/createUser",
  AdminLogin: "api/admin/login",
} as const;

export const AuthApiRoutes = {
  UserLogin: "api/user/userLogin",
} as const;