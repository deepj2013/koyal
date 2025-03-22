import { useState } from "react";

export const VideoPlayer = ({ videoSrc }) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative z-50 md:w-[25rem] md:h-[25rem] w-[15rem] h-[15rem] bg-black rounded-2xl overflow-hidden">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
      />

      <button
        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center w-12 h-12 shadow-lg transition-all hover:bg-white/30"
        onClick={() => setIsMuted(!isMuted)}
      >
        <img
          src={
            isMuted
              ? "https://cdn-icons-png.flaticon.com/512/727/727240.png"
              : "https://cdn-icons-png.flaticon.com/512/727/727269.png"
          }
          alt={isMuted ? "Muted" : "Unmuted"}
          className="w-6 h-6 filter invert"
        />
      </button>
    </div>
  );
};
