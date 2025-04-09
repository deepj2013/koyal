import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { persistStore } from "redux-persist";
import AppReducer from "../features/appSlice";
import uploadAudioReducer from "../features/uploadSlice";
import lyricEditReducer from "../features/lyricEditSlice";
import collectionReducer from "../features/collectionSlice";
import AuthReducer from "../features/authSlice";
import { uploadAudioApi } from "../services/uploadAudioService/uploadAudioApi";
import { lyricEditApi } from "../services/lyricEditService/lyricEditApi";
import { chooseCharacterApi } from "../services/chooseCharacterService/chooseCharacterApi";
import { waitingListApi } from "../services/waitingListService/waitingListApi";
import { editSceneApi } from "../services/editSceneService/editSceneApi";
import { finalVideoApi } from "../services/finalVideoService/finalVideoApi";
import { adminApi } from "../services/adminService/adminApi";
import { authApi } from "../services/authService/authApi";
import { collectionApi } from "../services/collectionService/collectionApi";

const persistConfig = {
  key: "root",
  storage: storage,
};

const rootReducer = combineReducers({
  app: AppReducer,
  uploadAudio: uploadAudioReducer,
  lyricEdit: lyricEditReducer,
  auth: AuthReducer,
  collection : collectionReducer,
  [uploadAudioApi.reducerPath]: uploadAudioApi.reducer,
  [lyricEditApi.reducerPath]: lyricEditApi.reducer,
  [chooseCharacterApi.reducerPath]: chooseCharacterApi.reducer,
  [waitingListApi.reducerPath]: waitingListApi.reducer,
  [editSceneApi.reducerPath]: editSceneApi.reducer,
  [finalVideoApi.reducerPath]: finalVideoApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [collectionApi.reducerPath]: collectionApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      uploadAudioApi.middleware,
      lyricEditApi.middleware,
      chooseCharacterApi.middleware,
      waitingListApi.middleware,
      editSceneApi.middleware,
      finalVideoApi.middleware,
      adminApi.middleware,
      authApi.middleware,
      collectionApi.middleware
    ]),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
