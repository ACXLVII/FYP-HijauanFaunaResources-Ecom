'use client'

import React from 'react';

// Icon Imports
import { TbGardenCart } from 'react-icons/tb'

export default function SectionHeading() {
  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
        
        {/* Heading */}
        <div className="flex flex-row gap-2 lg:gap-4 mb-2 lg:mb-4">
          <div title="Shop" className="flex items-center justify-center px-3 lg:px-4 py-1 lg:py-2 bg-[#498118] rounded-lg lg:rounded-xl">
            <TbGardenCart className="size-5 lg:size-8 text-[#FFFFFF]" />
          </div>
          <h1 className="flex items-center font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
            Shopping Cart
          </h1>
        </div>

        {/* Breadcrumb */}
        <p className="text-balance text-md lg:text-lg text-[#4A5565]">
          Check your items before proceeding to checkout.
        </p>
        
      </div>
    </div>
  )
}