import { clockSvg, removeSvg } from "../../../assets";
import { FileUpload } from "../../common/FilePicker/FilePicker";

const UploadCollection = ({ handleNext}) => {
    return (
      <div className="px-20 max-w-[1200px]">
        <div className="w-full my-12 space-y-12">
          <div className="border rounded-lg p-4 bg-[#F8F9FC] shadow-sm">
            <h2 className="text-base font-semibold mb-2">
              About Koyal Collections
            </h2>{" "}
            <p className="text-sm text-gray-600 mt-1">
              Create stunning music videos for one or multiple songs at once. Our
              AI-powered system will generate unique visuals that match your
              music's rhythm, mood, and style. Perfect for artists looking to
              create consistent visual content across their entire album or
              playlist.
            </p>
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <img src={clockSvg} alt="" />
                <span>Processing time: 2-3 minutes per song</span>
              </div>
              <div className="flex items-center gap-1">
                <img src={removeSvg} />
                <span>Bulk processing available</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <FileUpload />
        </div>
        <div className="flex justify-end w-full mt-12 mx-auto">
          <button className="px-6 py-1 mr-2 h-[40px] border border-gray-300 rounded-md text-gray-500">
            Cancel
          </button>
          <button
            className={`px-6 py-1 h-[40px] rounded-md relative group ${
              !true
                ? "bg-gray-300 text-gray-800"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            disabled={!true}
            onClick={handleNext}
          >
            Continue to Customize
            {!true && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-[16px] font-normal leading-[24px] tracking-[0%] px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity min-w-[220px] ">
                Please upload audio to move to next step
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  export default UploadCollection;