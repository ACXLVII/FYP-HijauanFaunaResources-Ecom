'use client';

import React from "react";
import ARPreviewMultiPlacement from '@/app/arPreview/ARPreviewMultiPlacement';
import { TbAugmentedReality2 } from 'react-icons/tb';

// Icon Imports
import {
  BiSolidLeaf
} from 'react-icons/bi';
import {
  GiBandageRoll,
  GiBarefoot,
  GiDesert,
  GiFallingLeaf,
  GiGrass,
  GiHighGrass,
  GiPalmTree
} from "react-icons/gi";
import {
  IoSparklesSharp
} from 'react-icons/io5';
import {
  PiPlantBold,
  PiScissorsFill,
  PiSunFill
} from 'react-icons/pi';
import {
  TbRuler,
  TbTexture
} from "react-icons/tb";

// Icon Map
const IconMap = {
  // Measurements
  TbRuler,
  GiBandageRoll,
  // Live Grass Icons
  // Japanese
  TbTexture,
  GiFallingLeaf,
  GiDesert,
  // Philippine
  IoSparklesSharp,
  PiScissorsFill,
  PiSunFill,
  // Pearl
  PiPlantBold,
  GiPalmTree,
  GiGrass,
  // Cow
  BiSolidLeaf,
  GiBarefoot,
  GiHighGrass,
};

export default function ProductCard({ product }) {
  // Helper function to get AR model paths for live grass based on product name
  const getARModelPaths = (productName) => {
    const nameLower = (productName || '').toLowerCase();
    
    // Map product names to model paths
    if (nameLower.includes('japanese')) {
      return { 
        modelSrc: '/models/live_grass/japanese.glb',
        iosSrc: '/models/live_grass/japanese.usdz'
      };
    } else if (nameLower.includes('philippine')) {
      return { 
        modelSrc: '/models/live_grass/philippine.glb',
        iosSrc: '/models/live_grass/philippine.usdz'
      };
    } else if (nameLower.includes('pearl')) {
      return { 
        modelSrc: '/models/live_grass/pearl.glb',
        iosSrc: '/models/live_grass/pearl.usdz'
      };
    } else if (nameLower.includes('cow')) {
      return { 
        modelSrc: '/models/live_grass/cow.glb',
        iosSrc: '/models/live_grass/cow.usdz'
      };
    }
    
    return null;
  };

  // iOS AR Quick Look function
  const handleIOSAR = (iosSrc) => {
    if (!iosSrc) return;
    
    const arAnchor = document.createElement('a');
    arAnchor.rel = 'ar';
    const iosUrl = new URL(iosSrc, window.location.origin);
    iosUrl.hash = 'allowsContentScaling=0';
    arAnchor.href = iosUrl.href;
    document.body.appendChild(arAnchor);
    arAnchor.click();
    setTimeout(() => {
      if (document.body.contains(arAnchor)) {
        document.body.removeChild(arAnchor);
      }
    }, 100);
  };
  
  // Helper function to convert base64 string to data URI
  const getImageSrc = (imageData) => {
    if (!imageData) {
      // Generate fallback path from product name
      let identifier = (product.slug || product.name || '').toLowerCase();
      
      // Handle different naming variations
      if (identifier.includes('cow')) {
        identifier = 'cow';
      } else if (identifier.includes('japanese')) {
        identifier = 'japanese';
      } else if (identifier.includes('pearl')) {
        identifier = 'pearl';
      } else if (identifier.includes('philippine')) {
        identifier = 'philippine';
      } else {
        identifier = identifier.replace(/\s+/g, '_');
      }
      
      if (identifier) {
        return `/images/shop/live_grass/${identifier}/CoverImage.jpg`;
      }
      
      return '/images/shop/LiveGrassTexture.jpg';
    }
    
    // Handle if imageData is an object with src property
    const imageString = typeof imageData === 'object' && imageData.src ? imageData.src : imageData;
    
    // If it's not a string, return fallback
    if (typeof imageString !== 'string') {
      return getImageSrc(null);
    }
    
    // If it's already a data URI or URL, return as is
    if (imageString.startsWith('data:') || imageString.startsWith('http') || imageString.startsWith('/')) {
      return imageString;
    }
    
    // If it's a base64 string without prefix, add the data URI prefix
    const imageType = 'jpeg';
    return `data:image/${imageType};base64,${imageString}`;
  };
  
  const imageSrc = product.images?.[0] ? getImageSrc(product.images[0]) : getImageSrc(null);

  return (
    <div
      className="block overflow-hidden bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg"
      role="button"
      tabIndex={0}
    >

      {/* Cover Image */}
      <img
        src={imageSrc}
        alt={product.name || 'Product image'}
        className="object-cover aspect-4/3 w-full"
        onError={(e) => {
          console.log('Image load error for product:', product.name, 'src:', e.target.src);
          // Generate fallback on error
          let identifier = (product.slug || product.name || '').toLowerCase();
          if (identifier.includes('cow')) identifier = 'cow';
          else if (identifier.includes('japanese')) identifier = 'japanese';
          else if (identifier.includes('pearl')) identifier = 'pearl';
          else if (identifier.includes('philippine')) identifier = 'philippine';
          
          if (identifier && e.target.src !== `/images/shop/live_grass/${identifier}/CoverImage.jpg`) {
            e.target.src = `/images/shop/live_grass/${identifier}/CoverImage.jpg`;
          } else if (e.target.src !== '/images/shop/LiveGrassTexture.jpg') {
            e.target.src = '/images/shop/LiveGrassTexture.jpg';
          }
        }}
      />

      {/* Product Details BEGINS */}
      <div className="p-4 lg:p-8">

        {/* Title */}
        <h1 className="mb-4 lg:mb-8 font-bold tracking-tight text-2xl lg:text-3xl text-[#101828]">
          {product.name}
        </h1>

        {/* Stock Status */}
        <div className="mb-4 lg:mb-8">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm lg:text-md font-semibold ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 grid-rows-3 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {Array.isArray(product.features) && product.features.map((features, idx) => {
            const Icon = IconMap[features.icon];
            return (
              <div key={idx} className="flex flex-row items-center justify-center p-2 lg:p-4 rounded-lg lg:rounded-xl border border-[#C39533]">
                {Icon && <Icon className="size-6 lg:size-8 mr-2 lg:mr-4 text-[#C39533]" />}
                <h2 className="font-bold tracking-tight text-md lg:text-lg text-[#C39533]">
                  {features.title}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="overflow-hidden mb-4 lg:mb-8 rounded-lg lg:rounded-xl border border-[#C39533]">
          <div className={`grid ${product.priceGroup?.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {product.priceGroup?.[0] && (
              <div className="flex flex-col items-center justify-center p-2 lg:p-4">
                {IconMap[product.priceGroup[0].icon] && (
                  React.createElement(IconMap[product.priceGroup[0].icon], { className: "size-8 lg:size-12 mb-2 lg:mb-4 text-[#C39533]" })
                )}
                <p className="flex items-center justify-center mb-1 lg:mb-2 font-bold tracking-tight text-2xl lg:text-3xl text-[#498118]">
                  RM {Number(product.priceGroup[0].price).toFixed(2)}
                </p>
                <p className="flex items-center justify-center text-sm lg:text-md text-[#4A5565]">
                  ( per {product.priceGroup[0].sizeType} )
                </p>
              </div>
            )}
            {product.priceGroup?.[1] && (
              <div className="flex flex-col items-center justify-center p-2 lg:p-4 border-l border-[#C39533]">
              {IconMap[product.priceGroup[1].icon] && (
                React.createElement(IconMap[product.priceGroup[1].icon], { className: "size-8 lg:size-12 mb-2 lg:mb-4 text-[#C39533]" })
              )}
              <p className="flex items-center justify-center mb-1 lg:mb-2 font-bold tracking-tight text-2xl lg:text-3xl text-[#498118]">
                RM {Number(product.priceGroup[1].price).toFixed(2)}
              </p>
              <p className="flex items-center justify-center text-sm lg:text-md text-[#4A5565]">
                ( per {product.priceGroup[1].sizeType} )
              </p>
            </div>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          className={`w-full p-2 lg:p-4 rounded-lg lg:rounded-xl shadow-lg transition ${
            product.inStock
              ? 'bg-[#498118] hover:scale-105 active:scale-95 active:shadow-none cursor-pointer'
              : 'bg-[#AAAAAA] cursor-not-allowed'
          }`}
          onClick={() => product.inStock && (window.location.href = `/shop/live_grass/product/${product.doc_id}`)}
          disabled={!product.inStock}
        >
          <h1 className="flex items-center justify-center font-bold tracking-tight text-lg lg:text-xl text-[#FFFFFF]">
            {product.inStock ? 'Select' : 'Out of Stock'}
          </h1>
        </button>

        {/* AR Preview Button - Android Only */}
        {(() => {
          const arPaths = getARModelPaths(product.name);
          if (!arPaths) return null;
          
          return (
            <ARPreviewMultiPlacement
              className="w-full p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-105 active:scale-95 disabled:opacity-70 mt-2 lg:mt-3"
              modelSrc={arPaths.modelSrc}
              arPlacement="floor"
            >
              <div className="flex items-center justify-center gap-2 lg:gap-4">
                <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                  Preview in AR (Android)
                </h1>
              </div>
            </ARPreviewMultiPlacement>
          );
        })()}

        {/* iOS AR Button - Quick Look */}
        {(() => {
          const arPaths = getARModelPaths(product.name);
          if (!arPaths || !arPaths.iosSrc) return null;
          
          return (
            <button
              className="w-full p-2 lg:p-4 bg-[#623183] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-105 active:scale-95 mt-2 lg:mt-3"
              onClick={() => handleIOSAR(arPaths.iosSrc)}
            >
              <div className="flex items-center justify-center gap-2 lg:gap-4">
                <TbAugmentedReality2 className="text-xl lg:text-2xl text-[#FFFFFF]" />
                <h1 className="font-bold tracking-tight text-md lg:text-lg text-[#FFFFFF]">
                  Preview in AR
                </h1>
              </div>
            </button>
          );
        })()}

      </div>
      {/* Product Details ENDS */}

    </div>
  );
}