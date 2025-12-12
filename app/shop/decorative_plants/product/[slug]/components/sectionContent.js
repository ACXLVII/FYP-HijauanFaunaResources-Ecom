'use client'

import React from 'react';

import SectionImageSlideshow from './subComponents/sectionImageSlideshow';
import PricingCalculator from './subComponents/sectionPricingCalculator';

/**
 * SectionContent displays product details and the pricing calculator.
 * @param {object} props
 * @param {object} props.product - The product data.
 */
export default function SectionContent({product}) {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">

        {/* Content Border BEGINS */}
        <div className="overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">

          {/* SECTION BIG */}
          <div className="overflow-hidden lg:col-span-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
            
            {/* Image Slideshow */}
            <div className="">
              <SectionImageSlideshow images={product.images} />
            </div>
            
            {/* Description */}
            <div className="py-4 lg:py-8">
              <h2 className="mb-1 lg:mb-2 font-bold tracking-tight text-md lg:text-lg text-[#C39533]">
                Description
              </h2>
              <p className="text-justify text-md lg:text-lg text-[#4A5565]">
                {product.description}
              </p>
            </div>

          </div>

          {/* SECTION SMALL */}
          <div className="lg:col-span-4">

            {/* Pricing Calculator */}
            <div className="shadow-lg">
              <PricingCalculator
                id={product.id}
                category={product.category}
                name={product.name}
                images={product.images}
                priceGroup={product.priceGroup}
                inStock={product.inStock}
              />
            </div>

          </div>

        </div>
        {/* Content Border ENDS */}

      </div>
    </div>
  );
}

