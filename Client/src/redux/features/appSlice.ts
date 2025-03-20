import { createSlice } from "@reduxjs/toolkit";
import { AppModel } from "../models/appModel";

const initialState: AppModel = {
  characterName: "",
  loraPath: null,
  styleImagesUrl: null,
  protoPromptsUrl: null,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setCharacterName: (state, action) => {
      state.characterName = action.payload;
    },
    setLoraPath: (state, action) => {
      state.loraPath = action.payload;
    },
    setStyleImagesUrl: (state, action) => {
      state.styleImagesUrl = action.payload;
    },
    setProtoPromptsUrl: (state, action) => {
      state.protoPromptsUrl = action.payload;
    },
  },
});

export const {
  setLoraPath,
  setStyleImagesUrl,
  setProtoPromptsUrl,
  setCharacterName,
} = appSlice.actions;

export default appSlice.reducer;

export const AppState = (state: any) => state?.app;