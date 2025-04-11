import { ApiRoutes } from "../../environment/apiRoutes";
import { externalApiSlice } from "../../environment/base";

export const lyricEditApi = externalApiSlice.injectEndpoints({
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
  }),
});

export const { useSceneLLMEndpointMutation, useLazyGetStoryElementQuery } =
  lyricEditApi;
