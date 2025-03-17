import { createSlice } from "@reduxjs/toolkit";
import { UploadAudioModel } from "../models/uploadAudioModel";

const initialState: UploadAudioModel = {
  sceneDataFileUrl: null,
};

const uploadAudioSlice = createSlice({
  name: "uploadAudio",
  initialState: initialState,
  reducers: {
    setSceneDataFileUrl: (state, action) => {
      state.sceneDataFileUrl = action.payload;
    },
  },
});

export const { setSceneDataFileUrl } = uploadAudioSlice.actions;

export default uploadAudioSlice.reducer;

export const UploadAudioState = (state: any) => state?.uploadAudio;
