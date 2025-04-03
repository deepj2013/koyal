import { AdminApiRoutes } from "../../environment/apiRoutes";
import { apiSlice } from "../../environment/base";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: AdminApiRoutes.AdminLogin,
        method: "POST",
        body: data,
      }),
    }),
    createUser: builder.mutation({
      query: ({data, token}) => ({
        url: AdminApiRoutes.CreateUser,
        method: "POST",
        body: data,
        headers:  { 'x-auth-token': token },
      }),
    }),
  }),
});

export const { useAdminLoginMutation, useCreateUserMutation } = adminApi;
