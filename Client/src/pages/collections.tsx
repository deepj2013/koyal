import React from "react";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/common/LoadingBar/LoadingBar";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CollectionState } from "../redux/features/collectionSlice";

const Collection = () => {
  const { isLoading } = useSelector(CollectionState);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <LoadingBar isLoading={isLoading} />
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Collection;
