import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/adminLogin";
import { PageRoutes } from "./appRoutes";
import AdminRoute from "../components/routing/adminRoute/AdminRoutes";
import PrivateRoute from "../components/routing/privateRoute/PrivateRoutes";
import Collection from "../pages/collections";
import PublicPage from "../pages/PublicPage";
import Login from "../pages/login";
import LoadingPage from "../pages/Loadingpage";
import WaitingList from "../pages/waitingList";
import CreateUser from "../pages/createUser";
import AudioUploadPage from "../pages/newuploadPage";
import TranscriptPage from "../pages/reviewTranscript";
import ChooseCharacterPage from "../pages/chooseCharacterPage";
import CharacterSelectionPage from "../pages/characterSelection";
import FinalVideoPage from "../pages/finaVedio";
import Home from "../pages/home";
import GenerateVideoPage from "../pages/edtiScence";

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<PublicPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/waitList" element={<WaitingList />} />
        <Route path={PageRoutes.ADMIN_LOGIN} element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path={PageRoutes.CREATE_USER} element={<CreateUser />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/upload" element={<AudioUploadPage />} />
          <Route path="/lyricedit" element={<TranscriptPage />} />
          <Route path="/choosecharacter" element={<ChooseCharacterPage />} />
          <Route
            path="/characterSelection"
            element={<CharacterSelectionPage />}
          />
          <Route path="/editscene" element={<GenerateVideoPage />} />
          <Route path="/finalvideo" element={<FinalVideoPage />} />
          <Route path={PageRoutes.CREATE_USER} element={<CreateUser />} />
          <Route path={PageRoutes.COLLECTION} element={<Collection />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
