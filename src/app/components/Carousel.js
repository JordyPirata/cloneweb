// components/Carousel.js
import { Button, Image } from "@nextui-org/react";
import { useState } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageArray = Object.entries(images);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out transform">
          {imageArray.map(([key, value], index) => (
            <a
              key={index}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={value}
                alt={`Slide ${index}`}
                className={`w-full h-auto ${
                  index === currentIndex ? "" : "hidden"
                }`}
              />
            </a>
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl"
      >
        {"<"}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl"
      >
        {">"}
      </button>
    </div>
  );
};

export default Carousel;
