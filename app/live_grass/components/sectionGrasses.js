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
      className="relative flex items-center justify-center aspect-4/3 w-full bg-[#000000]"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={images[index]}
        alt="Slideshow"
        className="object-cover aspect-4/3 w-full"
        width={800}
        height={600}
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

export default function SectionGrasses() {
  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Heading */}
        <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
          Our Selection
        </h1>

        {/* Grass Grid BEGINS */}
        <div className="flex flex-col gap-8 lg:gap-16">
          
          {/* Japanese Grass */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/live_grass/grasses/japanese/image1.jpg',
                '/images/live_grass/grasses/japanese/image2.jpg',
                '/images/live_grass/grasses/japanese/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Japanese Grass
                </h1>

                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  Known for its fine, dense texture and rich green hue, Japanese grass offers a clean, carpet-like finish that adds elegance to any lawn. Ideal for high-end landscapes,
                  residential gardens, and spaces where aesthetics matter most.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Perfect for:</span> homeowners, premium gardens, aesthetic lawn lovers.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/live_grass/japanese.glb"
                    iosSrc="/models/live_grass/japanese.usdz"
                    posterSrc="/images/live_grass/grasses/japanese/image1.jpg"
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
                    onClick={() => window.location.href = '/shop/live_grass/product/xIDYfgqdsLZkwB8ZCCmb'}
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

          {/* Philippine Grass */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/live_grass/grasses/philippine/image1.jpg',
                '/images/live_grass/grasses/philippine/image2.jpg',
                '/images/live_grass/grasses/philippine/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Philippine Grass
                </h1>

                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  Light, soft, and gentle on bare feet, Philippine grass is your go-to for comfort and tropical charm. It grows fast and adapts well to shaded areas, making it a
                  family-friendly favorite for homes with kids or pets.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Perfect for:</span> shaded lawns, family backyards, barefoot play zones.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/live_grass/philippine.glb"
                    iosSrc="/models/live_grass/philippine.usdz"
                    posterSrc="/images/live_grass/grasses/philippine/image1.jpg"
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
                    onClick={() => window.location.href = '/shop/live_grass/product/JSbTUJKyOGdUlNXCXlgL'}
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

          {/* Pearl Grass */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/live_grass/grasses/pearl/image1.jpg',
                '/images/live_grass/grasses/pearl/image2.jpg',
                '/images/live_grass/grasses/pearl/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Pearl Grass
                </h1>
                
                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  With its signature glossy leaves and vibrant green tone, Pearl grass gives your space a fresh, dewy look all day long. It thrives in moist soil and offers a
                  beautiful, low-growing cover for modern yards.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Perfect for:</span> decorative landscaping, borders, garden beds.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/live_grass/pearl.glb"
                    iosSrc="/models/live_grass/pearl.usdz"
                    posterSrc="/images/live_grass/grasses/pearl/image1.jpg"
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
                    onClick={() => window.location.href = '/shop/live_grass/product/BddydnecjzrKOkSKaiqN'}
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

          {/* Cow Grass */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImageSlideshow images={[
                '/images/live_grass/grasses/cow/image1.jpg',
                '/images/live_grass/grasses/cow/image2.jpg',
                '/images/live_grass/grasses/cow/image3.jpg'
              ]} />
              <div className="p-4 lg:p-8 bg-[#C39533]">
                
                {/* Title */}
                <h1 className="w-fit p-2 mb-2 lg:mb-4 bg-[#000000]/70 font-bold tracking-tight text-3xl lg:text-4xl text-[#FFFFFF]">
                  Cow Grass
                </h1>

                {/* Description */}
                <p className="p-2 mb-2 lg:mb-4 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  Durable and easy to maintain, Cow grass is a cost-effective solution for wide areas and outdoor spaces. Its broad blades and hardy nature make it great for
                  playgrounds, parks, or lawns with frequent foot traffic.
                </p>
                <p className="p-2 mb-4 lg:mb-8 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                  <span className="font-bold">Perfect for:</span> schools, open fields, budget-friendly lawn coverage.
                </p>
                
                {/* Button Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <ARPreviewButton
                    className="p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                    modelSrc="/models/live_grass/cow.glb"
                    iosSrc="/models/live_grass/cow.usdz"
                    posterSrc="/images/live_grass/grasses/cow/image1.jpg"
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
                    onClick={() => window.location.href = '/shop/live_grass/product/eAe19J533jbyniNOCK8N'}
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
        {/* Grass Grid ENDS */}

      </div>
    </div>
  );
}