import { ApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const chooseCharacterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    editStoryElement: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.SceneLLMEndpoint,
        method: "POST",
        body: data,
      }),
    }),
    preprocessCharacter: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.PreProcessCharacter,
        method: "POST",
        body: data,
      }),
    }),

    getProcessedCharacter: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.ProcessedCharResult}/${callId}`,
        method: "GET",
      }),
    }),
    trainCharacter: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.TrainCharacter,
        method: "POST",
        body: data,
      }),
    }),

    getTrainedCharacter: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetTrainedCharacter}/${callId}`,
        method: "GET",
      }),
    }),
    submitStyle: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.SubmitStyle,
        method: "POST",
        body: data,
      }),
    }),
    getStyle: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetStyleEndpoint}/${callId}`,
        method: "GET",
      }),
    }),
    processAvatar: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.ProcessAvatar,
        method: "POST",
        body: data,
      }),
    }),
    getProcessedAvatar: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetProcessedAvatar}/${callId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useEditStoryElementMutation,
  usePreprocessCharacterMutation,
  useSubmitStyleMutation,
  useTrainCharacterMutation,
  useProcessAvatarMutation,
  useLazyGetProcessedCharacterQuery,
  useLazyGetTrainedCharacterQuery,
  useLazyGetStyleQuery,
  useLazyGetProcessedAvatarQuery,
} = chooseCharacterApi;
