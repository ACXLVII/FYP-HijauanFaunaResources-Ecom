'use client'

import React, { useState } from 'react';
import Image from 'next/image';

// Icon Imports
import { IoCloseOutline } from "react-icons/io5";

function SectionImageSlideshow({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  // Helper function to convert base64 string to data URI (matching live_grass pattern)
  const getImageSrc = (imageData) => {
    if (!imageData) return '';
    
    // Handle if imageData is an object with src property
    const imageString = typeof imageData === 'object' && imageData.src ? imageData.src : imageData;
    
    // If it's not a string, return empty
    if (typeof imageString !== 'string') {
      return '';
    }
    
    // If it's already a data URI or URL, return as is
    if (imageString.startsWith('data:') || imageString.startsWith('http') || imageString.startsWith('/')) {
      return imageString;
    }
    
    // If it's a base64 string without prefix, add the data URI prefix
    const imageType = 'jpeg';
    return `data:image/${imageType};base64,${imageString}`;
  };

  return (
    <div className="overflow-hidden flex flex-col">
      
      {/* Preview */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={getImageSrc(images[selectedIndex])}
          alt={`Preview ${selectedIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover rounded-md lg:rounded-lg cursor-zoom-in"
          width={800}
          height={600}
          unoptimized={getImageSrc(images[selectedIndex]).startsWith('data:')}
          onClick={() => setModalOpen(true)}
        />
      </div>

      {/* Gallery */}
      <div className="overflow-x-auto flex gap-2 lg:gap-4 mt-2 lg:mt-4 p-0.5">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={getImageSrc(img)}
            alt={`Thumbnail ${idx + 1}`}
            className={`aspect-square h-16 lg:h-20 w-16 lg:w-20 object-cover rounded-md lg:rounded-lg transition ${
              idx === selectedIndex
                ? 'ring-2 ring-[#C39533]'
                : 'opacity-50 cursor-pointer'
            }`}
            width={800}
            height={600}
            unoptimized={getImageSrc(img).startsWith('data:')}
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0"
              onClick={() => setModalOpen(false)}
            >
              <IoCloseOutline className="size-10 lg:size-12 text-[#FFFFFF] active:text-[#E1C46A] cursor-pointer"/>
            </button>
            <Image
              src={getImageSrc(images[selectedIndex])}
              alt={`Enlarged ${selectedIndex + 1}`}
              className="object-contain max-h-[90vh] max-w-[90vw]"
              width={800}
              height={600}
              unoptimized={getImageSrc(images[selectedIndex]).startsWith('data:')}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default SectionImageSlideshow; 