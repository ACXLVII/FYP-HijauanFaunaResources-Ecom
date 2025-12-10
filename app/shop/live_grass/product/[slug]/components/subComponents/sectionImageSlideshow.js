import React, { useState } from 'react';

// Icon Imports
import { IoCloseOutline } from "react-icons/io5";

function SectionImageSlideshow({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Generate fallback images based on product name
  const getFallbackImages = () => {
    let identifier = (productName || '').toLowerCase();
    
    if (identifier.includes('cow')) {
      identifier = 'cow';
    } else if (identifier.includes('japanese')) {
      identifier = 'japanese';
    } else if (identifier.includes('pearl')) {
      identifier = 'pearl';
    } else if (identifier.includes('philippine')) {
      identifier = 'philippine';
    }
    
    if (identifier) {
      return [
        `/images/shop/live_grass/${identifier}/CoverImage.jpg`,
        `/images/shop/live_grass/${identifier}/image1.jpg`,
        `/images/shop/live_grass/${identifier}/image2.jpg`,
        `/images/shop/live_grass/${identifier}/image3.jpg`
      ];
    }
    
    return ['/images/shop/LiveGrassTexture.jpg'];
  };

  const fallbackImages = getFallbackImages();
  
  // Helper to get image source from string or object
  const getImageSrc = (img) => {
    if (typeof img === 'string' && img.trim()) return img;
    if (typeof img === 'object' && img.src && img.src.trim()) return img.src;
    return '';
  };
  
  // Check if Firebase images are valid
  const hasValidImages = images && images.length > 0 && images.some(img => {
    const src = getImageSrc(img);
    return src && src.trim() !== '';
  });
  
  const displayImages = hasValidImages ? images : fallbackImages;

  return (
    <div className="overflow-hidden flex flex-col">
      
      {/* Preview */}
      <div className="relative aspect-[4/3] w-full">
        <img
          src={getImageSrc(displayImages[selectedIndex]) || fallbackImages[0]}
          alt={`Preview ${selectedIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover rounded-md lg:rounded-lg cursor-zoom-in"
          onClick={() => setModalOpen(true)}
          onError={(e) => {
            console.log('Image load error:', e.target.src);
            e.target.src = fallbackImages[0];
          }}
        />
      </div>

      {/* Gallery */}
      <div className="overflow-x-auto flex gap-2 lg:gap-4 mt-2 lg:mt-4 p-0.5">
        {displayImages.map((img, idx) => (
          <img
            key={idx}
            src={getImageSrc(img) || fallbackImages[idx] || fallbackImages[0]}
            alt={`Thumbnail ${idx + 1}`}
            className={`aspect-square h-16 lg:h-20 w-16 lg:w-20 object-cover rounded-md lg:rounded-lg transition ${
              idx === selectedIndex
                ? 'ring-2 ring-[#C39533]'
                : 'opacity-50 cursor-pointer'
            }`}
            onClick={() => setSelectedIndex(idx)}
            onError={(e) => {
              e.target.src = fallbackImages[idx] || fallbackImages[0];
            }}
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
              src={getImageSrc(displayImages[selectedIndex]) || fallbackImages[selectedIndex] || fallbackImages[0]}
              alt={`Enlarged ${selectedIndex + 1}`}
              className="object-contain max-h-[90vh] max-w-[90vw]"
              onError={(e) => {
                e.target.src = fallbackImages[selectedIndex] || fallbackImages[0];
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default SectionImageSlideshow; 