import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/common/LoadingBar/LoadingBar";
import CollectionCustomization from "../components/layouts/collections/CollectionCustomization";
import UploadCollection from "../components/layouts/collections/UploadCollection";
import { EditCollectionScene } from "../components/layouts/collections/EditCollectionScene";

const Collection = () => {
  const [stage, setStage] = useState(0);

  const handleNext = () => {
    setStage((p) => p + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <LoadingBar isLoading={false} />
      <div className="flex justify-center">
        {stage === 0 && <UploadCollection handleNext={handleNext} />}
        {stage === 1 && <CollectionCustomization handleNext={handleNext} />}
        {stage === 2 && <EditCollectionScene handleNext={handleNext} />}
      </div>
    </div>
  );
};

export default Collection;
