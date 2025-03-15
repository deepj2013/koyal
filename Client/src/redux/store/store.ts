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
import { uploadAudioApi } from "../services/uploadAudioService/uploadAudioApi";

const persistConfig = {
  key: "root",
  storage: storage,
};

const rootReducer = combineReducers({
  uploadAudio: uploadAudioReducer,
  [uploadAudioApi.reducerPath]: uploadAudioApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([uploadAudioApi.middleware]),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
