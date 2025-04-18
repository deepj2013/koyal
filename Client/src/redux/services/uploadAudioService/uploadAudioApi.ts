import { ApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const uploadAudioApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    emotionEndpoint: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.EmotionEndpoint,
        method: "POST",
        body: data,
      }),
    }),
    transcriberEndpoint: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.TranscriberEndpoint,
        method: "POST",
        body: data,
      }),
    }),
    sceneEndpoint: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.SceneEndpoint,
        method: "POST",
        body: data,
      }),
    }),
    getEmotionResult: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.EmotionResultEndpoint}/${callId}`,
        method: "GET",
      }),
    }),
    getTranscriberResult: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.TranscriberResultEndpoint}/${callId}`,
        method: "GET",
      }),
    }),
    getSceneResult: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.SceneResultEndpoint}/${callId}`,
        method: "GET",
      }),
    }),
   
  }),
});

export const {
  useEmotionEndpointMutation,
  useTranscriberEndpointMutation,
  useGetTranscriberResultQuery,
  useLazyGetTranscriberResultQuery,
  useGetEmotionResultQuery,
  useLazyGetEmotionResultQuery,
  useSceneEndpointMutation,
  useLazyGetSceneResultQuery,
} = uploadAudioApi;
