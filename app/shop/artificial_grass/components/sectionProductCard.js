'use client'

import React from 'react';
import Image from 'next/image';

// Icon Imports
import {
  FaCloudSunRain,
  FaHandSparkles,
  FaRegGrinStars,
  FaRegThumbsUp
} from 'react-icons/fa';
import {
  GiBandageRoll,
  GiBarefoot,
  GiGardeningShears,
  GiGolfFlag,
  GiGolfTee,
  GiGrass,
  GiHighGrass,
  GiReceiveMoney
} from "react-icons/gi";
import {
  GrUpgrade
} from "react-icons/gr";
import {
  MdGrass,
  MdOutlineTexture
} from "react-icons/md";
import {
  TbRuler
} from "react-icons/tb";
import {
  WiStars,
} from "react-icons/wi";

// Icon Map
const IconMap = {
  // Measurement Icons
  TbRuler,
  GiBandageRoll,
  // Artificial Grass Icons
  // 15mm
  GiGolfTee,
  GiGolfFlag,
  GrUpgrade,
  // 25mm
  GiReceiveMoney,
  FaCloudSunRain,
  GiGardeningShears,
  // 30mm
  FaRegThumbsUp,
  MdOutlineTexture,
  FaHandSparkles,
  // 35mm
  GiHighGrass,
  GiBarefoot,
  GiGrass,
  // 40mm
  WiStars,
  FaRegGrinStars,
  MdGrass,
};

export default function ProductCard({ product }) {
  
  // Helper function to convert base64 string to data URI
  const getImageSrc = (imageData) => {
    if (!imageData) return '/images/shop/ArtificialGrassTexture.jpg';
    // If it's already a data URI or URL, return as is
    if (imageData.startsWith('data:') || imageData.startsWith('http') || imageData.startsWith('/')) {
      return imageData;
    }
    // If it's a base64 string, convert to data URI
    // Try to detect image type, default to jpeg
    const imageType = imageData.match(/^data:image\/(\w+);base64,/) 
      ? imageData.split(';')[0].split('/')[1] 
      : 'jpeg';
    // If it already has the data URI prefix, return as is
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    // Otherwise, add the data URI prefix
    return `data:image/${imageType};base64,${imageData}`;
  };
  const imageSrc = product.images?.[0] ? getImageSrc(product.images[0]) : '/images/shop/ArtificialGrassTexture.jpg';

  return (
    <div
      className="block overflow-hidden bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg"
      role="button"
      tabIndex={0}
    >

      {/* Cover Image */}
      <Image
        src={imageSrc}
        alt={product.name}
        className="object-cover aspect-4/3 w-full"
        width={800}
        height={600}
        unoptimized={imageSrc.startsWith('data:')} // Disable optimization for base64 images
      />

      {/* Product Details BEGINS */}
      <div className="p-4 lg:p-8">

        {/* Title */}
        <h1 className="mb-4 lg:mb-8 font-bold tracking-tight text-2xl lg:text-3xl text-[#101828]">
          {product.name}
        </h1>

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
          className="w-full p-2 lg:p-4 bg-[#498118] rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-105 active:scale-95"
          onClick={() => window.location.href = `/shop/artificial_grass/product/${product.doc_id}`}
        >
          <h1 className="flex items-center justify-center font-bold tracking-tight text-lg lg:text-xl text-[#FFFFFF]">
            Select
          </h1>
        </button>

      </div>
      {/* Product Details ENDS */}

    </div>
  );
}