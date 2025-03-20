import { ApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const editSceneApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    processFluxPrompts: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.ProcessFluxPrompts,
        method: "POST",
        body: data,
      }),
    }),

    getFluxPrompts: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetFluxPrompts}/${callId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useProcessFluxPromptsMutation,
  useLazyGetFluxPromptsQuery,
} = editSceneApi;

