import { useEffect, useState } from "react";

export const AutoImageSlider = ({
  images,
  interval = 3000,
  autoPlay = true,
  currentButtonColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [images.length, interval, autoPlay]);

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt="Sliding Images"
        className="rounded-[80px] w-full transition-all duration-700 ease-in-out object-cover h-[90%]"
      />

      {/* Dots Navigation (Placed Below Image) */}
      <div className="flex justify-center mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              backgroundColor:
                currentIndex === index ? currentButtonColor : "#d1d5db",
            }}
            className={`w-3 h-3 rounded-full transition-all mx-1 ${
              currentIndex === index ? "w-4 h-4" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};
