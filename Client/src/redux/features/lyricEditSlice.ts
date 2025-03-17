import { createSlice } from "@reduxjs/toolkit";
import { LyricEditModel } from "../models/lyricEditModel";

const initialState: LyricEditModel = {
  storyEleementFileUrl: null,
};

const lyricEditSlice = createSlice({
  name: "lyricEdit",
  initialState: initialState,
  reducers: {
    setStoryEleementFileUrl: (state, action) => {
      state.storyEleementFileUrl = action.payload;
    },
  },
});

export const { setStoryEleementFileUrl } = lyricEditSlice.actions;

export default lyricEditSlice.reducer;

export const LyricEditState = (state: any) => state?.lyricEdit;
