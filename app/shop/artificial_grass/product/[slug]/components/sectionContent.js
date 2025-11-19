'use client'

import React from 'react';

import SectionImageSlideshow from './subComponents/sectionImageSlideshow';
import PricingCalculator from './subComponents/sectionPricingCalculator';

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

            {/* Features */}
            <div className="flex flex-col gap-2 lg:gap-4">
              {Array.isArray(product.features) && product.features.map((features, idx) => {
                const Icon = IconMap[features.icon];
                return (
                  <div key={idx} className="overflow-hidden grid grid-cols-1 rounded-lg lg:rounded-xl border border-[#C39533]">
                    <div className="flex flex-row items-center p-2 lg:p-4 border-b border-[#C39533]">
                      {Icon && <Icon className="size-6 lg:size-8 mr-2 lg:mr-4 text-[#C39533]" />}
                      <h2 className="font-bold tracking-tight text-md lg:text-lg text-[#C39533]">
                        {features.title}
                      </h2>
                    </div>
                    <p className="p-2 lg:p-4 text-sm lg:text-md text-[#4A5565]">
                      {features.description}
                    </p>
                  </div>
                );
              })}
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
              />
            </div>

          </div>

          

        </div>
        {/* Content Border ENDS */}

      </div>
    </div>
  );
}