'use client';

import React from "react";
import Image from 'next/image';

export default function ProductCard({ product }) {
  // Helper function to convert base64 string to data URI
  const getImageSrc = (imageData) => {
    if (!imageData) {
      // Use generic fallback for pebble rocks
      return '/images/shop/rocks.jpg';
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
      <Image
        src={imageSrc}
        alt={product.name || 'Product image'}
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

        {/* Pricing */}
        <div className="overflow-hidden mb-4 lg:mb-8 rounded-lg lg:rounded-xl border border-[#C39533]">
          <div className="flex flex-col items-center justify-center p-4 lg:p-6">
            <p className="flex items-center justify-center mb-1 lg:mb-2 font-bold tracking-tight text-2xl lg:text-3xl text-[#498118]">
              RM {Number(product.priceGroup?.[0]?.price || 0).toFixed(2)}
            </p>
            <p className="flex items-center justify-center text-sm lg:text-md text-[#4A5565]">
              per {product.priceGroup?.[0]?.sizeType || 'unit'}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          className={`w-full p-2 lg:p-4 rounded-lg lg:rounded-xl shadow-lg transition ${
            product.inStock
              ? 'bg-[#498118] hover:scale-105 active:scale-95 active:shadow-none cursor-pointer'
              : 'bg-[#AAAAAA] cursor-not-allowed'
          }`}
          onClick={() => product.inStock && (window.location.href = `/shop/pebble_rocks/product/${product.doc_id}`)}
          disabled={!product.inStock}
        >
          <h1 className="flex items-center justify-center font-bold tracking-tight text-lg lg:text-xl text-[#FFFFFF]">
            {product.inStock ? 'Select' : 'Out of Stock'}
          </h1>
        </button>

      </div>
      {/* Product Details ENDS */}

    </div>
  );
}

