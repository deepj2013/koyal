import homebg from "../../../assets/vedio/koyal_bg.mp4";
import React, { useRef, useEffect } from "react";

const VideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Attempt to play video on component mount
    const playVideo = () => {
      if (video) {
        video.play().catch((error) => {
          console.log("Autoplay was prevented:", error);
        });
      }
    };

    // Add event listeners for various play attempts
    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadedmetadata", playVideo);

    setTimeout(function () {
      document.getElementById("vid").play();
    }, 1000);
    return () => {
      // Cleanup event listeners
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadedmetadata", playVideo);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 w-full h-full md:object-cover object-fill"
      playsInline
      autoPlay={true}
      loop={true}
      muted={true}
      webkit-playsinline="true"
      x5-playsinline="true"
      id="vid"
    >
      <source src={homebg} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;


