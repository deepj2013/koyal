import { createSlice } from "@reduxjs/toolkit";
import { AppModel } from "../models/appModel";

const initialState: AppModel = {
  characterName: "",
  loraPath: null,
  styleImagesUrl: null,
  protoPromptsUrl: null,
  lyricsJsonUrl: null,
  imageFolderUrl: null,
  scenesJson: null,
  replacementWord: "person",
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
    setLyricsJsonUrl: (state, action) => {
      state.lyricsJsonUrl = action.payload;
    },
    setScenesJson: (state, action) => {
      state.scenesJson = action.payload;
    },
    setImageFolderUrl: (state, action) => {
      state.imageFolderUrl = action.payload;
    },
    setReplacementWord: (state, action) => {
      state.replacementWord = action.payload;
    },
  },
});

export const {
  setLoraPath,
  setStyleImagesUrl,
  setProtoPromptsUrl,
  setCharacterName,
  setLyricsJsonUrl,
  setScenesJson,
  setImageFolderUrl,
  setReplacementWord
} = appSlice.actions;

export default appSlice.reducer;

export const AppState = (state: any) => state?.app;
