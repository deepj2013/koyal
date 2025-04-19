import { ApiRoutes, InternalApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const lyricEditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sceneLLMEndpoint: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.SceneLLMEndpoint,
        method: "POST",
        body: data,
      }),
    }),

    getStoryElement: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.StoryElementEndpoint}/${callId}`,
        method: "GET",
      }),
    }),
    editLyrics: builder.mutation({
      query: (data) => ({
        url: InternalApiRoutes.LyricsUpdate,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useSceneLLMEndpointMutation,
  useLazyGetStoryElementQuery,
  useEditLyricsMutation,
} = lyricEditApi;
