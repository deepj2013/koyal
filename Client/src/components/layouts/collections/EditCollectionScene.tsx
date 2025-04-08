import React, { useEffect, useState } from "react";
import {
  collectionListHeaders,
  StyleColors,
  styles,
  VideoOrientationStyles,
} from "../../../utils/constants";
import { GenerateIcon, pencilIcon } from "../../../assets";
import {
  IoSquareOutline,
  IoTabletLandscapeOutline,
  IoTabletPortraitOutline,
} from "react-icons/io5";
import EditSongModal from "./EditSaveModal";
import {
  useEditAudioDetailsMutation,
  useLazyGetAudioDetailsQuery,
} from "../../../redux/services/collectionService/collectionApi";
import { CollectionState } from "../../../redux/features/collectionSlice";
import { useSelector } from "react-redux";

export const VideoOrientationIcons = {
  [VideoOrientationStyles.PORTRAIT]: <IoTabletPortraitOutline />,
  [VideoOrientationStyles.LANDSCAPE]: <IoTabletLandscapeOutline />,
  [VideoOrientationStyles.SQUARE]: <IoSquareOutline />,
};

export const EditCollectionScene = ({ handleNext }) => {
  const { taskId, groupId } = useSelector(CollectionState);

  const [getAudioDetails, { data: audioDetailsData }] =
    useLazyGetAudioDetailsQuery();
  const [editAudioDetails, { data: editAudioDetailsData }] =
    useEditAudioDetailsMutation();

  const [selectedScene, setSelectedScene] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [isEdit, setIsEdit] = useState(null);

  const isConfirmDisabled = () => {
    const { theme, character, style, orientation, audioId } =
      selectedScene || {};
    return !theme || !character || !style || !orientation || !audioId;
  };

  const onConfirmEdit = () => {
    setSelectedScene(null);
    const { sceneId, title, ...rest } = selectedScene;

    editAudioDetails({
      id: sceneId,
      data: rest,
    });
  };

  const addScene = () => {
    setIsEdit(false);
    setSelectedScene({
      theme: "",
      character: "",
      style: "",
      orientation: "",
      audioId: null,
    });
  };

  const handleEdit = (scene) => {
    setIsEdit(true);
    setSelectedScene(scene);
  };

  useEffect(() => {
    getAudioDetails({ taskId, groupId });
  }, []);

  useEffect(() => {
    if (audioDetailsData) {
      const sceneList = [];
      const themeList = [];
      for (const element of audioDetailsData?.data) {
        const {
          _id,
          audioDetails: {
            originalFileName,
            theme,
            character,
            style,
            orientation,
          },
        } = element.taskLogs;

        themeList.push({
          text: originalFileName,
          value: _id,
        });
        sceneList.push({
          title: originalFileName,
          theme: theme,
          character: character,
          style: style,
          orientation: orientation,
          sceneId: _id,
          audioId: _id,
        });
      }
      setScenes(sceneList);
      setThemeOptions(themeList);
    }
  }, [audioDetailsData]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-6xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">
        {audioDetailsData?.data?.[0]?.taskLogs?.audioDetails?.collectionName}
      </h1>

      <div className="mb-6 flex items-center">
        <p className="text-sm text-gray-700 mr-2">Style Key:</p>
        <div className="flex space-x-4">
          {styles.map((style) => (
            <div key={style.id} className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${StyleColors[style.id]}`}
              ></div>
              <span className="text-sm">{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b">
              {collectionListHeaders.map((header) => (
                <th
                  key={header.id}
                  className="py-2 px-4 text-left text-sm font-medium text-gray-700 bg-[#F9FAFB]"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenes.map((scene, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-gray-500 border-b-4 border-b-transparent"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {scene.title}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                  {scene.theme}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {scene.character}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        StyleColors[scene.style.toLowerCase()]
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">{scene.style}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex items-center sw-6 h-6 mr-1">
                      {VideoOrientationIcons[scene.orientation]}
                    </div>
                    <span className="text-sm text-gray-600">
                      {scene.orientation}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 flex justify-center">
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => handleEdit(scene)}
                  >
                    <div className="w-5 h-5  rounded">
                      <img src={pencilIcon} alt="" />
                    </div>
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                    <div className="w-5 h-5 rounded-full">
                      <img src={GenerateIcon} alt="" />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditSongModal
        isEdit={isEdit}
        isOpen={selectedScene}
        onClose={() => setSelectedScene(null)}
        onConfirm={onConfirmEdit}
        options={themeOptions}
        selectedScene={selectedScene}
        setSelectedScene={setSelectedScene}
        isConfirmDisabled={isConfirmDisabled()}
      />

      <div className="flex justify-center mt-6">
        <button
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          onClick={addScene}
        >
          <span className="text-xl font-bold text-gray-600">+</span>
        </button>
      </div>
    </div>
  );
};
