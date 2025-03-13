import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 1,
});
