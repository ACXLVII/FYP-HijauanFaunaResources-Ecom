'use client'

import React from 'react';
import Image from 'next/image';

// Icon Imports
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { TbAugmentedReality2, TbGardenCart } from "react-icons/tb";
import ARPreviewMultiPlacement from '../../arPreview/ARPreviewMultiPlacement';

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
      className="overflow-hidden relative flex items-center justify-center h-64 lg:h-80 w-full bg-[#000000]"
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

export default function SectionThickness() {
  const [isIOS, setIsIOS] = React.useState(false);

  React.useEffect(() => {
    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
                       (platform === 'macintel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto pt-16 lg:pt-32 pb-8 lg:pb-16">
        
        {/* Heading */}
        <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
          Thickness Options
        </h1>

        {/* Thickness Grid BEGINS */}
        <div className="flex flex-col gap-8 lg:gap-16">
          
          {/* 15 mm Golf */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-[#C39533]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ImageSlideshow images={[
                '/images/artificial_grass/thicknesses/15mmGolf.jpg'
              ]} />
              <div className="p-3 lg:p-6 bg-[#C39533] flex flex-col justify-center">
                
                 {/* Title */}
                 <h1 
                   className="w-fit mb-2 lg:mb-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
                   style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
                 >
                   15 mm Golf
                 </h1>

                 {/* Description */}
                 <p 
                   className="mb-2 lg:mb-3 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   Golf course quality grass for a professional look. This is the most durable and realistic option for golf courses. It is also the most expensive option.
                 </p>
                 <p 
                   className="mb-3 lg:mb-4 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   <span className="font-bold">Best for:</span> balconies, decorative use, golf courses.
                 </p>
                
               {/* Button Grid */}
               <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  {!isIOS && (
                    <ARPreviewMultiPlacement
                      className="p-2 lg:p-3 bg-[#623183] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                      modelSrc="/models/artificial_grass/15mm.glb"
                      arPlacement="floor"
                    >
                      <div className="flex items-center justify-center gap-2 lg:gap-4">
                        <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                        <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                          Preview in AR
                        </h1>
                      </div>
                    </ARPreviewMultiPlacement>
                  )}
                  <button
                    className="p-2 lg:p-3 bg-[#498118] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass'}
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
          
          {/* 25 mm */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-[#C39533]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ImageSlideshow images={[
                '/images/artificial_grass/thicknesses/25mm.jpg'
              ]} />
              <div className="p-3 lg:p-6 bg-[#C39533] flex flex-col justify-center">
                
                 {/* Title */}
                 <h1 
                   className="w-fit mb-2 lg:mb-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
                   style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
                 >
                   25 mm
                 </h1>

                 {/* Description */}
                 <p 
                   className="mb-2 lg:mb-3 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   Slightly thicker with a more natural feel, 25mm grass adds a touch of softness without going too plush. It's a great middle ground for small yards, play zones, or
                   those who want a simple yet realistic look.
                 </p>
                 <p 
                   className="mb-3 lg:mb-4 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   <span className="font-bold">Best for:</span> home gardens, play corners, rentals.
                 </p>
                
               {/* Button Grid */}
               <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  {!isIOS && (
                    <ARPreviewMultiPlacement
                      className="p-2 lg:p-3 bg-[#623183] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                      modelSrc="/models/artificial_grass/25mm.glb"
                      arPlacement="floor"
                    >
                      <div className="flex items-center justify-center gap-2 lg:gap-4">
                        <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                        <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                          Preview in AR
                        </h1>
                      </div>
                    </ARPreviewMultiPlacement>
                  )}
                  <button
                    className="p-2 lg:p-3 bg-[#498118] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass'}
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
          
          {/* 30 mm */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-[#C39533]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ImageSlideshow images={[
                '/images/artificial_grass/thicknesses/30mm.jpg'
              ]} />
              <div className="p-3 lg:p-6 bg-[#C39533] flex flex-col justify-center">
                
                 {/* Title */}
                 <h1 
                   className="w-fit mb-2 lg:mb-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
                   style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
                 >
                   30 mm
                 </h1>

                 {/* Description */}
                 <p 
                   className="mb-2 lg:mb-3 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   A customer favorite! 30mm strikes the perfect balance between comfort and appearance. It looks lush without being too thick, offering soft steps and durability for
                   everyday use.
                 </p>
                 <p 
                   className="mb-3 lg:mb-4 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   <span className="font-bold">Best for:</span> family lawns, pet areas, lifestyle upgrades.
                 </p>
                
               {/* Button Grid */}
               <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  {!isIOS && (
                    <ARPreviewMultiPlacement
                      className="p-2 lg:p-3 bg-[#623183] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                      modelSrc="/models/artificial_grass/30mm.glb"
                      arPlacement="floor"
                    >
                      <div className="flex items-center justify-center gap-2 lg:gap-4">
                        <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                        <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                          Preview in AR
                        </h1>
                      </div>
                    </ARPreviewMultiPlacement>
                  )}
                  <button
                    className="p-2 lg:p-3 bg-[#498118] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass'}
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
          
          {/* 35 mm */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-[#C39533]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ImageSlideshow images={[
                '/images/artificial_grass/thicknesses/35mm.jpg'
              ]} />
              <div className="p-3 lg:p-6 bg-[#C39533] flex flex-col justify-center">
                
                 {/* Title */}
                 <h1 
                   className="w-fit mb-2 lg:mb-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
                   style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
                 >
                   35 mm
                 </h1>

                 {/* Description */}
                 <p 
                   className="mb-2 lg:mb-3 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   Want that lush, "just watered" lawn feel? 35mm grass brings realistic softness and a full-bodied texture. Perfect for relaxing, entertaining, or letting the kids
                   roll around safely.
                 </p>
                 <p 
                   className="mb-3 lg:mb-4 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   <span className="font-bold">Best for:</span> show gardens, villas, rooftop lounges, premium projects.
                 </p>
                
               {/* Button Grid */}
               <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  {!isIOS && (
                    <ARPreviewMultiPlacement
                      className="p-2 lg:p-3 bg-[#623183] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                      modelSrc="/models/artificial_grass/35mm.glb"
                      arPlacement="floor"
                    >
                      <div className="flex items-center justify-center gap-2 lg:gap-4">
                        <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                        <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                          Preview in AR
                        </h1>
                      </div>
                    </ARPreviewMultiPlacement>
                  )}
                  <button
                    className="p-2 lg:p-3 bg-[#498118] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass'}
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
          
          {/* 40 mm */}
          <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-[#C39533]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ImageSlideshow images={[
                '/images/artificial_grass/thicknesses/40mm.jpg'
              ]} />
              <div className="p-3 lg:p-6 bg-[#C39533] flex flex-col justify-center">
                
                 {/* Title */}
                 <h1 
                   className="w-fit mb-2 lg:mb-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
                   style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
                 >
                   40 mm
                 </h1>

                 {/* Description */}
                 <p 
                   className="mb-2 lg:mb-3 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   Step into luxury with 40mm artificial grass. It's dense, bouncy, and beautifully lifelike. It mimics the feel of real grass at its best, making it perfect for
                   high-end homes and modern landscapes.
                 </p>
                 <p 
                   className="mb-3 lg:mb-4 text-justify text-sm lg:text-base text-[#000000]"
                 >
                   <span className="font-bold">Best for:</span> designer lawns, premium properties, barefoot comfort.
                 </p>
                
               {/* Button Grid */}
               <div className="grid grid-cols-1 gap-3 lg:gap-4">
                  {!isIOS && (
                    <ARPreviewMultiPlacement
                      className="p-2 lg:p-3 bg-[#623183] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99 disabled:opacity-70"
                      modelSrc="/models/artificial_grass/40mm.glb"
                      arPlacement="floor"
                    >
                      <div className="flex items-center justify-center gap-2 lg:gap-4">
                        <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                        <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                          Preview in AR
                        </h1>
                      </div>
                    </ARPreviewMultiPlacement>
                  )}
                  <button
                    className="p-2 lg:p-3 bg-[#498118] rounded-lg lg:rounded-xl shadow-md active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
                    onClick={() => window.location.href = '/shop/artificial_grass'}
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
        {/* Thickness Grid ENDS */}

      </div>
    </div>
  );
}