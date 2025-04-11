import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/config";

const BASE_URL = config.baseUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState()?.auth?.userInfo?.token;
    if (token) {
      headers.set("x-auth-token", token);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});


const externalBaseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

// Create an enhanced base query that includes status code
const baseQueryWithStatus = async (args, api, extraOptions) => {
  const result: any = await externalBaseQuery(args, api, extraOptions);
  const statusCode = result.meta?.response?.status || 200;

  if (result?.data) {
    return {
      ...result,
      data: {
        data: result.data,
        statusCode: statusCode,
      },
    };
  }
  return result;
};


export const apiSlice = createApi({
  reducerPath: "internalApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 1,
});

export const externalApiSlice = createApi({
  reducerPath: "externalApi",
  baseQuery: baseQueryWithStatus,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 1,
});

