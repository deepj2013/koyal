import { AuthApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data) => ({
        url: AuthApiRoutes.UserLogin,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUserLoginMutation } = authApi;
