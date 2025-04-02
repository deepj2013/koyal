import { useState } from "react";
import VisualStyleComponent from "../characterSelection/VisualStyle";
import { CharacterStyles } from "../../../utils/constants";
import { animatedStyle, realisticStyle, sketchStyle } from "../../../assets";

const styles = [
  { name: CharacterStyles.REALISTIC, image: realisticStyle },
  { name: CharacterStyles.ANIMATED, image: animatedStyle },
  { name: CharacterStyles.SKETCH, image: sketchStyle },
];

const CollectionCustomization = ({ handleNext }) => {
  const [styleImages, setStyleImages] = useState<any>(styles);
  const [orientationStyle, setOrientationStyle] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(styles[1]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="px-20 max-w-[1200px]">
      <div className="w-[800px] mx-auto bg-white p-6 rounded-lg shadow-md border mt-2 mb-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Collection Customization</h2>
          <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
            Upload Excel
          </button>
        </div>
        {/* Input Fields */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name your collection
            </label>
            <input
              type="text"
              placeholder="e.g. Coffee Playlist or Drake India Promotions"
              className="w-full mt-1 p-3 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Overall Theme
            </label>
            <input
              type="text"
              placeholder="e.g. Cyberpunk City, Medieval Fantasy, Space Adventure"
              className="w-full mt-1 p-3 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Custom Character
            </label>
            <p className="text-sm text-gray-500">
              Describe the custom character or use specific token if already
              created
            </p>
            <input
              type="text"
              placeholder='e.g. "canadian man, appears to be in his 40’s, beard, light-skinned"'
              className="w-full mt-1 p-3 border rounded-lg text-sm"
            />
          </div>
        </div>
        <label className="block text-sm mt-4 font-medium text-gray-700">
          Visual Style
        </label>
        <VisualStyleComponent
          styleImages={styleImages}
          setSelectedStyle={setSelectedStyle}
          selectedStyle={selectedStyle}
          orientationStyle={orientationStyle}
          setOrientationStyle={setOrientationStyle}
          selected={selected}
          setSelected={setSelected}
          isCollectionPage={true}
        />
        <p className="text-sm text-gray-500 mt-4">
          Don’t worry, you can customize per audio file on the next screen :)
        </p>

        <div className="flex justify-end mt-4">
          <button className="bg-black text-white py-3 px-4 rounded-lg text-sm" onClick={handleNext}>
            Edit Final Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCustomization;
