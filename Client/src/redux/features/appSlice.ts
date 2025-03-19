import { createSlice } from "@reduxjs/toolkit";
import { AppModel } from "../models/appModel";

const initialState: AppModel = {
  loraPath: null,
  styleImagesUrl: null
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setLoraPath: (state, action) => {
      state.loraPath = action.payload;
    },
    setStyleImagesUrl: (state, action) => {
      state.styleImagesUrl = action.payload;
    },
  },
});

export const { setLoraPath, setStyleImagesUrl } = appSlice.actions;

export default appSlice.reducer;

export const AppState = (state: any) => state?.app;
