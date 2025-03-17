export const ApiRoutes = {
  EmotionEndpoint: "/emotion_endpoint/submit",
  TranscriberEndpoint: "/transcriber_endpoint/submit",
  EmotionResultEndpoint: "/emotion_endpoint/result",
  TranscriberResultEndpoint: "/transcriber_endpoint/result",
  SceneEndpoint: "/scene_endpoint/submit",
  SceneResultEndpoint: "/scene_endpoint/result",
  SceneLLMEndpoint: "/scene_llm_endpoint/submit",
  StoryElementEndpoint: "scene_llm_endpoint/result",
} as const;
