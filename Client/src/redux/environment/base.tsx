import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/config";

const BASE_URL = config.baseUrl;

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
