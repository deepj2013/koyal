import { ApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const waitingListApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWaitingList: builder.query({
      query: () => ({
        url: ApiRoutes.WaitingList,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetWaitingListQuery } = waitingListApi;
