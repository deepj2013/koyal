import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ audioUrl, fileName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const resolvedAudioUrl = audioUrl || fileName || null;

  const togglePlayPause = () => {
    if (!audioRef.current || !resolvedAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center">
      <div
        className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:shadow-md group"
        onClick={togglePlayPause}
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-100 group-hover:shadow-sm">
          <button
            aria-label={isPlaying ? "Pause" : "Play"}
            className="focus:outline-none"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
            ) : (
              <Play className="w-4 h-4 text-gray-700 ml-1 group-hover:text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {resolvedAudioUrl && (
        <audio
          ref={audioRef}
          src={resolvedAudioUrl}
          onEnded={() => setIsPlaying(false)}
          preload="none"
        />
      )}
    </div>
  );
};

export default AudioPlayer;
