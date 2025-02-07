import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import UploadPage from "./pages/uploadPage";
import LyricsEditor from "./pages/LyricsEditor";
import "@fontsource/gloria-hallelujah"; //
import Home from "./pages/home";
import Login from "./pages/login";
import AudioUploadPage from "./pages/newuploadPage";
import TranscriptPage from "./pages/reviewTranscript";
import LoadingPage from "./pages/Loadingpage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/start" element={<PublicPage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/upload" element={<UploadPage />} /> */}
      <Route path="/upload" element={<AudioUploadPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/lyricedit" element={<TranscriptPage />} />
      {/* <Route path="/lyricedit" element={<LyricsEditor />} /> */}
    </Routes>
  );
};

export default App;