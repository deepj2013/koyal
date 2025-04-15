import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/config";
import { showErrorToater } from "../../utils/helper";
import { setIsLoading } from "../features/collectionSlice";
import { AppError } from "../../utils/constants";

const BASE_URL = config.baseUrl;

const rawBaseQuery = fetchBaseQuery({
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

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  api.dispatch(setIsLoading(true));
  const result: any = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    // showErrorToater(result.error?.data?.error?.message || AppError.GENERAL_ERROR);
  }
  api.dispatch(setIsLoading(false));
  return result;
};

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 1,
});
