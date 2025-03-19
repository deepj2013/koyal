import { createSlice } from "@reduxjs/toolkit";
import { UploadAudioModel } from "../models/uploadAudioModel";

const initialState: UploadAudioModel = {
  sceneDataFileUrl: null,
  audioType: null,
};

const uploadAudioSlice = createSlice({
  name: "uploadAudio",
  initialState: initialState,
  reducers: {
    setSceneDataFileUrl: (state, action) => {
      state.sceneDataFileUrl = action.payload;
    },
    setAudioType: (state, action) => {
      state.audioType = action.payload;
    },
  },
});

export const { setSceneDataFileUrl, setAudioType } = uploadAudioSlice.actions;

export default uploadAudioSlice.reducer;

export const UploadAudioState = (state: any) => state?.uploadAudio;
