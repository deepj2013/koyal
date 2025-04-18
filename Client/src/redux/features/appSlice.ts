import { createSlice } from "@reduxjs/toolkit";
import { AppModel } from "../models/appModel";

const initialState: AppModel = {
  isProcessing: null,
  isEnglish: null,
  characterName: "",
  loraPath: null,
  audioFileUrl: null,
  styleImagesUrl: null,
  protoPromptsUrl: null,
  lyricsJsonUrl: null,
  imageFolderUrl: null,
  scenesJson: null,
  replacementWord: "person",
  isCharchaChosen: null,
  characterFolderPath: null,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setIsProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setIsEnglish: (state, action) => {
      state.isEnglish = action.payload;
    },
    setCharacterName: (state, action) => {
      state.characterName = action.payload;
    },
    setLoraPath: (state, action) => {
      state.loraPath = action.payload;
    },
    setAudioFileUrl: (state, action) => {
      state.audioFileUrl = action.payload;
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
    setIsCharchaChosen: (state, action) => {
      state.isCharchaChosen = action.payload;
    },
    setCharacterFolderPath: (state, action) => {
      state.characterFolderPath = action.payload;
    },
  },
});

export const {
  setIsProcessing,
  setIsEnglish,
  setCharacterName,
  setLoraPath,
  setAudioFileUrl,
  setStyleImagesUrl,
  setProtoPromptsUrl,
  setLyricsJsonUrl,
  setScenesJson,
  setImageFolderUrl,
  setReplacementWord,
  setIsCharchaChosen,
  setCharacterFolderPath,
} = appSlice.actions;

export default appSlice.reducer;

export const AppState = (state: any) => state?.app;
