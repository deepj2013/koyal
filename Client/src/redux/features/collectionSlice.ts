import { createSlice } from "@reduxjs/toolkit";
import { CollectionModel } from "../models/collectionModel";

const initialState: CollectionModel = {
  isLoading: false,
  bulkUploadedData: null,
  taskId: null,
  groupId: null,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState: initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setBulkUploadedData: (state, action) => {
      state.bulkUploadedData = action.payload;
    },
    setTaskId: (state, action) => {
      state.taskId = action.payload;
    },
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },
    clearCollectionState: () => {
      return initialState;
    },
  },
});

export const {
  setIsLoading,
  setBulkUploadedData,
  setTaskId,
  clearCollectionState,
  setGroupId,
} = collectionSlice.actions;

export default collectionSlice.reducer;

export const CollectionState = (state: any) => state?.collection;
