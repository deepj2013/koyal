import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/adminLogin";
import { PageRoutes } from "./appRoutes";
import AdminRoute from "../components/routing/adminRoute/AdminRoutes";
import PrivateRoute from "../components/routing/privateRoute/PrivateRoutes";
import Collection from "../pages/collections";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/home"));
const PublicPage = lazy(() => import("../pages/PublicPage"));
const Login = lazy(() => import("../pages/login"));
const AudioUploadPage = lazy(() => import("../pages/newuploadPage"));
const TranscriptPage = lazy(() => import("../pages/reviewTranscript"));
const LoadingPage = lazy(() => import("../pages/Loadingpage"));
const ChooseCharacterPage = lazy(() => import("../pages/chooseCharacterPage"));
const CharacterSelectionPage = lazy(
  () => import("../pages/characterSelection")
);
const EditScenes = lazy(() => import("../pages/edtiScence"));
const FinalVideoPage = lazy(() => import("../pages/finaVedio"));
const WaitingList = lazy(() => import("../pages/waitingList"));
const CreateUser = lazy(() => import("../pages/createUser"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
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
        <Route path="/waitList" element={<WaitingList />} />
        <Route path={PageRoutes.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path={PageRoutes.CREATE_USER} element={<CreateUser />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path={PageRoutes.COLLECTION} element={<Collection />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
