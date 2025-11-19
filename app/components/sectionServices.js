'use client'

import React from "react";

// Icon Imports
import { MdGrass } from "react-icons/md";
import { TbShovelPitchforks,TbTrees } from 'react-icons/tb'

export default function SectionServices() {
  const [showOverlay, setShowOverlay] = React.useState(false);

  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Heading */}
        <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#101828]">
          Our Services
        </h1>

        {/* Service Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          
          {/* Grass Installation  */}
          <div className="">
            
            {/* Icon and Image */}
            <div
              className="relative overflow-hidden aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              style={{
                backgroundImage: "url('/images/home_page/services/service1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-6 lg:p-8">
                  <MdGrass className="text-5xl lg:text-6xl text-[#C39533]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-balance text-2xl lg:text-3xl text-[#101828]">
              Grass Installation
            </h1>

            {/* Description */}
            <p className="text-justify text-md lg:text-lg text-[#4A5565]">
              Discover our range of live and artificial grass - available in a variety of textures and thicknesses.
            </p>

          </div>

          {/* Landscaping */}
          <div className="">

            {/* Icon and Image */}
            <div
              className="relative overflow-hidden aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              style={{
                backgroundImage: "url('/images/home_page/services/service2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-6 lg:p-8">
                  <TbTrees className="text-5xl lg:text-6xl text-[#C39533]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-balance text-2xl lg:text-3xl text-[#101828]">
              Landscaping
            </h1>

            {/* Description */}
            <p className="text-justify text-md lg:text-lg text-[#4A5565]">
              Enhance your outdoor space with our custom landscaping products that are tailored to your specific needs.
            </p>

          </div>

          {/* Maintenance */}
          <div className="">

            {/* Icon and Image */}
            <div
              className="relative overflow-hidden aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              style={{
                backgroundImage: "url('/images/home_page/services/service3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-6 lg:p-8">
                  <TbShovelPitchforks className="text-5xl lg:text-6xl text-[#C39533]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-balance text-2xl lg:text-3xl text-[#101828]">
              Maintenance
            </h1>

            {/* Description */}
            <p className="text-justify text-md lg:text-lg text-[#4A5565]">
                Keep your lawn and garden in proper condition with our professional maintenance services.
            </p>

          </div>

        </div>
        {/* Service Grid ENDS */}

      </div>
    </div>
  );
}