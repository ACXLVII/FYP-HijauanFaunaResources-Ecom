'use client'

import React from 'react';

// Icon Imports
import { TbGardenCart } from "react-icons/tb";
import Link from "next/link";

export default function SectionHeading({ product }) {
  // const product = live_grass_products.find((p) => p.slug === slug);
  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
        
        {/* Heading */}
        <div className="flex flex-row gap-2 lg:gap-4 mb-2 lg:mb-4">
          <div title="Shop" className="flex items-center justify-center px-3 lg:px-4 py-1 lg:py-2 bg-[#498118] rounded-lg lg:rounded-xl">
            <TbGardenCart className="size-5 lg:size-8 text-[#FFFFFF]" />
          </div>
          <h1 className="flex items-center font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
            {product ? product.name : '[Product Not Found]'}
          </h1>
        </div>

        {/* Breadcrumb */}
        <p className="text-balance text-md lg:text-lg text-[#4A5565]">
          <Link href="/shop" className="hover:underline active:text-[#C39533]">Shop</Link> {'> '}
          <Link href="/shop/live_grass" className="hover:underline active:text-[#C39533]">Live Grass</Link> {'> '}
          {product ? product.name : '[Product Not Found]'}.
        </p>
        
      </div>
    </div>
  )
}