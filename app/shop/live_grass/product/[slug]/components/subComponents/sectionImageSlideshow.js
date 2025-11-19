import React, { useState } from 'react';

// Icon Imports
import { IoCloseOutline } from "react-icons/io5";

function SectionImageSlideshow({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="overflow-hidden flex flex-col">
      
      {/* Preview */}
      <div className="relative aspect-[4/3] w-full">
        <img
          src={images[selectedIndex]}
          alt={`Preview ${selectedIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover rounded-md lg:rounded-lg cursor-zoom-in"
          onClick={() => setModalOpen(true)}
        />
      </div>

      {/* Gallery */}
      <div className="overflow-x-auto flex gap-2 lg:gap-4 mt-2 lg:mt-4 p-0.5">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            className={`aspect-square h-16 lg:h-20 w-16 lg:w-20 object-cover rounded-md lg:rounded-lg transition ${
              idx === selectedIndex
                ? 'ring-2 ring-[#C39533]'
                : 'opacity-50 cursor-pointer'
            }`}
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
            <img
              src={images[selectedIndex]}
              alt={`Enlarged ${selectedIndex + 1}`}
              className="object-contain max-h-[90vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default SectionImageSlideshow; 