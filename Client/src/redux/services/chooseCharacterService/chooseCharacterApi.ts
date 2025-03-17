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
  }),
});

export const { useEditStoryElementMutation } = chooseCharacterApi;
