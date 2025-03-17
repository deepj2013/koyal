import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import "@fontsource/gloria-hallelujah"; //
import Home from "./pages/home";
import Login from "./pages/login";
import AudioUploadPage from "./pages/newuploadPage";
import TranscriptPage from "./pages/reviewTranscript";
import LoadingPage from "./pages/Loadingpage";
import ChooseCharacterPage from "./pages/chooseCharacterPage";
import CharacterSelectionPage from "./pages/characterSelection";
import EditScenes from "./pages/edtiScence";
import FinalVideoPage from "./pages/finaVedio";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; 
import { persistor, store } from "./redux/store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<PublicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<AudioUploadPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/lyricedit" element={<TranscriptPage />} />
          <Route path="/choosecharacter" element={<ChooseCharacterPage />} />
          <Route
            path="/characterSelection"
            element={<CharacterSelectionPage />}
          />
          <Route path="/editscene" element={<EditScenes />} />
          <Route path="/finalvideo" element={<FinalVideoPage />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;
