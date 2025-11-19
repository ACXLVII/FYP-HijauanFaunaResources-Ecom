'use client'

import React from 'react';
import Image from 'next/image';

// Icon Imports
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { TbAugmentedReality2, TbGardenCart } from "react-icons/tb";
import ARPreviewButton from '../../arPreview/ARPreviewButton';

// Function to display a slideshow of images with swipe functionality for mobile devices.
function ImageSlideshow({ images }) {
  const [index, setIndex] = React.useState(0); // State to track the current image index.
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1)); // Function to go to the previous image, wrapping around if at the start.
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1)); // Function to go to the next image, wrapping around if at the end.

  const touchStartX = React.useRef(null); // Reference to store the initial touch position.
  const touchEndX = React.useRef(null); // Reference to store the final touch position after moving.

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX; // Store initial touch position.
    touchEndX.current = null; // Reset touchEndX to null on touch start.
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    if (touchStartX.current !== null) { // If touchStartX is set...
      const deltaX = Math.abs(touchEndX.current - touchStartX.current); // Calculate the distance moved.
      if (deltaX > 10) { // If the distance is greater than 10px...
        e.preventDefault(); // Prevent default scrolling behavior to allow swiping.
      }
    }
  };

  const handleTouchEnd = () => { // Function to handle the end of a touch event.
    if (touchStartX.current !== null && touchEndX.current !== null) { // If both touchStartX and touchEndX are set...
      const delta = touchStartX.current - touchEndX.current; // Calculate the difference between start and end positions.
      if (Math.abs(delta) > 40) { // If the swipe distance is greater than 40px...
        if (delta > 0) { // If swiped left (negative delta)...
          next(); // Swipe left.
        } else {
          prev(); // Swipe right
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="overflow-hidden relative flex items-center justify-center aspect-4/3 w-full bg-[#000000]"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={images[index]}
        alt="Slideshow"
        className="object-center object-cover"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={index === 0}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute h-full top-1/2 -translate-y-1/2 left-0 px-2 lg:px-4 text-xl lg:text-2xl"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={next}
            className="absolute h-full top-1/2 -translate-y-1/2 right-0 px-2 lg:px-4 text-xl lg:text-2xl"
          >
            <FaAngleRight />
          </button>
        </>
      )}
    </div>
  );
}

export default function SectionGrades() {
  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto pt-16 lg:pt-32 pb-8 lg:pb-16">
        
        {/* Heading */}
        <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
          Our Grades
        </h1>

        {/* Grades Grid BEGINS */}
        <div className="flex flex-col gap-8 lg:gap-16">
          
          {/* Economy */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/artificial_grass/grades/economy/image1.jpg',
                '/images/artificial_grass/grades/economy/image2.jpg',
                '/images/artificial_grass/grades/economy/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Economy
                </h1>

                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  A smart and budget-friendly choice for simple landscaping needs. Economy grass provides neat, green coverage with basic comfort and durability. It’s easy to install
                  and maintain, making it great for temporary setups, rental units, kids' play areas, or areas with low foot traffic.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Ideal for:</span> budget-conscious users, events, basic yard upgrades.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/artificial_grass/economy.glb"
                    iosSrc="/models/artificial_grass/economy.usdz"
                    posterSrc="/images/artificial_grass/grades/economy/image1.jpg"
                  >
                    <div className="flex items-center justify-center gap-2 lg:gap-4">
                      <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                      <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                        AR Preview
                      </h1>
                    </div>
                  </ARPreviewButton>
                  <button
                    className="p-2 lg:p-4 bg-[#498118] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass/economy'}
                  >
                    <div className="flex items-center justify-center gap-2 lg:gap-4">
                      <TbGardenCart className="text-xl lg:text-2xl text-[#FFFFFF]" />
                      <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                        View in Store
                      </h1>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Premium */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/artificial_grass/grades/premium/image1.jpg',
                '/images/artificial_grass/grades/premium/image2.jpg',
                '/images/artificial_grass/grades/premium/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Premium
                </h1>

                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  Designed for those who want the look and feel of luxury. Premium artificial grass offers ultra-realistic textures, multi-tone fibers, and soft-touch comfort which
                  is perfect for high-end landscapes, show homes, rooftop gardens, or pet-friendly spaces. It stays cooler underfoot, resists flattening, and looks lush all year round.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Ideal for:</span> homeowners, designers, commercial properties.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/artificial_grass/premium.glb"
                    iosSrc="/models/artificial_grass/premium.usdz"
                    posterSrc="/images/artificial_grass/grades/premium/image1.jpg"
                  >
                    <div className="flex items-center justify-center gap-2 lg:gap-4">
                      <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                      <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                        AR Preview
                      </h1>
                    </div>
                  </ARPreviewButton>
                  <button
                    className="p-2 lg:p-4 bg-[#498118] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass/premium'}
                  >
                    <div className="flex items-center justify-center gap-2 lg:gap-4">
                      <TbGardenCart className="text-xl lg:text-2xl text-[#FFFFFF]" />
                      <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                        View in Store
                      </h1>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
        {/* Grades Grid ENDS */}

      </div>
    </div>
  );
}