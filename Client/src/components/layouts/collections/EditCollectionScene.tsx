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
import {
  useAddNewAudioMutation,
  useEditAudioDetailsMutation,
  useLazyGetAllAudiosQuery,
  useLazyGetAudioDetailsQuery,
} from "../../../redux/services/collectionService/collectionApi";
import {
  CollectionState,
  setIsLoading,
} from "../../../redux/features/collectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaWrench } from "react-icons/fa";
import AddEditSongModal from "./EditSaveModal";
import AudioPlayer from "../../common/AudioPlayer/AudioPlayer";

export const VideoOrientationIcons = {
  [VideoOrientationStyles.PORTRAIT]: <IoTabletPortraitOutline />,
  [VideoOrientationStyles.LANDSCAPE]: <IoTabletLandscapeOutline />,
  [VideoOrientationStyles.SQUARE]: <IoSquareOutline />,
};

export const EditCollectionScene = () => {
  const dispatch = useDispatch();

  const { taskId, groupId } = useSelector(CollectionState);

  const [getAudioDetails, { data: audioDetailsData }] =
    useLazyGetAudioDetailsQuery();
  const [editAudioDetails, { data: editAudioDetailsData }] =
    useEditAudioDetailsMutation();
  const [addNewAudio, { data: addAudioData }] = useAddNewAudioMutation();
  const [getAllAudio, { data: getAllAudioData }] = useLazyGetAllAudiosQuery();

  const [selectedScene, setSelectedScene] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [isEdit, setIsEdit] = useState(null);

  const isConfirmDisabled = () => {
    const { theme, character, style, orientation, audioId } =
      selectedScene || {};
    return !theme || !character || !style || !orientation || !audioId;
  };

  const onConfirm = () => {
    const { sceneId, title, audioId, character, orientation, style, theme } =
      selectedScene;

    dispatch(setIsLoading(true));
    if (isEdit) {
      editAudioDetails({
        id: sceneId,
        data: {
          audioId,
          character,
          orientation,
          style,
          theme,
        },
      });
    } else {
      addNewAudio(selectedScene);
    }
    setSelectedScene(null);
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
    dispatch(setIsLoading(true));
    getAudioDetails({ taskId, groupId });
    getAllAudio({ groupId });
  }, []);

  useEffect(() => {
    if (audioDetailsData) {
      const sceneList = [];
      for (const element of audioDetailsData?.data) {
        const {
          _id,
          audioDetails: {
            audioId,
            audioUrl,
            originalFileName,
            theme,
            character,
            style,
            orientation,
          },
        } = element.taskLogs;

        sceneList.push({
          title: originalFileName,
          theme: theme,
          character: character,
          style: style,
          orientation: orientation,
          sceneId: _id,
          audioId: audioId,
          audioUrl: audioUrl,
        });
      }
      setScenes(sceneList);
      dispatch(setIsLoading(false));
    }
  }, [audioDetailsData]);

  useEffect(() => {
    if (editAudioDetailsData || addAudioData) {
      getAudioDetails({ taskId, groupId });
    }
  }, [editAudioDetailsData, addAudioData]);

  useEffect(() => {
    if (getAllAudioData) {
      setThemeOptions(
        getAllAudioData.data.map(({ fileName, _id }) => ({
          text: fileName?.substring(0, fileName.lastIndexOf(".")),
          value: _id,
        }))
      );
    }
  }, [getAllAudioData]);

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
                  <AudioPlayer audioUrl={scene?.audioUrl} />
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  {scene.title?.substring(0, scene.title.lastIndexOf("."))}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
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
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300  mx-auto"
                    onClick={() => handleEdit(scene)}
                  >
                    <div className="w-5 h-5 rounded-full">
                      <img src={pencilIcon} alt="" />
                    </div>
                  </button>
                </td>
                <td className="py-4 px-4 ">
                  <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300  mx-auto">
                    <div className="w-5 h-5 rounded-full">
                      <img src={GenerateIcon} alt="" />
                    </div>
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 mx-auto">
                    <div className="w-5 h-5 rounded-full">
                      <FaWrench />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddEditSongModal
        isEdit={isEdit}
        isOpen={selectedScene}
        onClose={() => setSelectedScene(null)}
        onConfirm={onConfirm}
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
