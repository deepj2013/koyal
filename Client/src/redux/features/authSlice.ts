import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from "../models/authModel";

const initialState: AuthModel = {
  adminInfo: null,
  isAdminLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.isAdminLoggedIn = true;
      state.adminInfo = action.payload;
    },
  },
});

export const { setAdminInfo } = authSlice.actions;

export default authSlice.reducer;

export const AuthState = (state: any) => state?.auth;
