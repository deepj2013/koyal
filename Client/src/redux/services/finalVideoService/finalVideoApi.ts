import { ApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const finalVideoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    processVideo: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.ProcessVideo,
        method: "POST",
        body: data,
      }),
    }),
    processFinalVideo: builder.mutation({
      query: (data) => ({
        url: ApiRoutes.ProcessFinalVideo,
        method: "POST",
        body: data,
      }),
    }),

    getProcessedVideo: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetProcessedVideo}/${callId}`,
        method: "GET",
      }),
    }),
    getFinalVideo: builder.query({
      query: (callId: string) => ({
        url: `${ApiRoutes.GetFinalVideo}/${callId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useProcessVideoMutation,
  useProcessFinalVideoMutation,
  useLazyGetProcessedVideoQuery,
  useLazyGetFinalVideoQuery,
} = finalVideoApi;
