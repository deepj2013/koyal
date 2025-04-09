import { CollectionApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const collectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bulkUploadAudio: builder.mutation({
      query: (data) => ({
        url: CollectionApiRoutes.BulkUploadAudio,
        method: "POST",
        body: data,
      }),
    }),
    bulkUploadAudioDetails: builder.mutation({
      query: ({ params, data }) => ({
        url: CollectionApiRoutes.BulkUploadAudioDetails,
        method: "PUT",
        params: params,
        body: data,
      }),
    }),
    getAudioDetails: builder.query({
      query: (params) => ({
        url: CollectionApiRoutes.GetAudioDetails,
        method: "GET",
        params,
      }),
    }),
    editAudioDetails: builder.mutation({
      query: ({id, data}) => ({
        url: `${CollectionApiRoutes.EditAudioDetails}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    addNewAudio: builder.mutation({
      query: (data) => ({
        url: CollectionApiRoutes.AddNewAudio,
        method: "POST",
        body: data,
      }),
    }),    
  }),
});

export const {
  useBulkUploadAudioMutation,
  useBulkUploadAudioDetailsMutation,
  useLazyGetAudioDetailsQuery,
  useEditAudioDetailsMutation,
  useAddNewAudioMutation,
} = collectionApi;
