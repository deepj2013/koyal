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
import uploadAudioReducer from "../features/uploadSlice";
import lyricEditReducer from "../features/lyricEditSlice";
import { uploadAudioApi } from "../services/uploadAudioService/uploadAudioApi";
import { lyricEditApi } from "../services/lyricEditService/lyricEditApi";
import { chooseCharacterApi } from "../services/chooseCharacterService/chooseCharacterApi";

const persistConfig = {
  key: "root",
  storage: storage,
};

const rootReducer = combineReducers({
  uploadAudio: uploadAudioReducer,
  lyricEdit: lyricEditReducer,
  [uploadAudioApi.reducerPath]: uploadAudioApi.reducer,
  [lyricEditApi.reducerPath]: lyricEditApi.reducer,
  [chooseCharacterApi.reducerPath]: chooseCharacterApi.reducer,
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
    ]),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
