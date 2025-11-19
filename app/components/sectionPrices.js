'use client'

import React from 'react';

// Icon Imports
import { TbRuler, TbRulerMeasure } from "react-icons/tb";
import { GiBandageRoll } from "react-icons/gi";

const SectionPrices = () => {
  return (
    <div className="bg-black/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-8 lg:mb-16">
          <h1 className="p-2 bg-[#000000]/70 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Our Prices
          </h1>
        </div>
        
        {/* Prices Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Live Grass BEGINS */}
          <div
            className="relative overflow-hidden p-4 lg:p-8 rounded-lg lg:rounded-xl shadow-lg"
            style={{ 
              backgroundImage: "url('/images/home_page/prices/LiveGrassTexture.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            
            {/* Text Block */}
            <h1 className="w-fit mb-4 lg:mb-8 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Live Grass
            </h1>
            <p className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold text-md lg:text-lg text-[#EEEEEE]">
                Starting from:
            </p>

            {/* Price Grid*/}
            <div className="grid grid-cols-1">
            
              {/* Per Tile */}
              <div className="overflow-hidden grid grid-cols-3 bg-[#000000]/70">
                <div className="flex items-center justify-center col-span-1 p-2 lg:p-4">
                  <TbRulerMeasure className="text-5xl lg:text-6xl text-[#FFFFFF]" />
                </div>
                <div className="col-span-2 p-2 lg:p-4">
                  <p className="mb-1 lg:mb-2 font-bold text-lg lg:text-xl text-[#FFFFFF]">
                    RM 5.00
                  </p>
                  <p className="mb-1 lg:mb-2 text-md lg:text-lg text-[#EEEEEE]">
                    per Tile
                  </p>
                  <p className="text-md lg:text-lg text-[#EEEEEE]">
                    (2ft x 1ft)
                  </p>
                </div>
              </div>

            </div>

          </div>
          {/* Live Grass ENDS */}

          {/* Artificial Grass BEGINS */}
          <div
            className="relative overflow-hidden p-4 lg:p-8 rounded-lg lg:rounded-xl shadow-lg"
            style={{ 
              backgroundImage: "url('/images/home_page/prices/ArtificialGrassTexture.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            
            {/* Text Block */}
            <h1 className="w-fit mb-4 lg:mb-8 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Artificial Grass
            </h1>
            <p className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold text-md lg:text-lg text-[#EEEEEE]">
                Starting from:
            </p>

            {/* Price Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
              {/* Per Square Feet */}
              <div className="overflow-hidden grid grid-cols-3 bg-[#000000]/70">
                <div className="flex items-center justify-center col-span-1 p-2 lg:p-4">
                  <TbRuler className="text-5xl lg:text-6xl text-[#FFFFFF]" />
                </div>
                <div className="col-span-2 p-2 lg:p-4">
                  <p className="mb-1 lg:mb-2 font-bold text-lg lg:text-xl text-[#FFFFFF]">
                    RM 3.00
                  </p>
                  <p className="mb-1 lg:mb-2 text-md lg:text-lg text-[#EEEEEE]">
                    per square feet
                  </p>
                  <p className="text-md lg:text-lg text-[#EEEEEE]">
                    (1ft x 1ft)
                  </p>
                </div>
              </div>

              {/* Per Roll */}
              <div className="overflow-hidden grid grid-cols-3 bg-[#000000]/70">
                <div className="flex items-center justify-center col-span-1 p-2 lg:p-4">
                  <GiBandageRoll className="text-5xl lg:text-6xl text-[#FFFFFF]" />
                </div>
                <div className="col-span-2 p-2 lg:p-4">
                  <p className="mb-1 lg:mb-2 font-bold text-lg lg:text-xl text-[#FFFFFF]">
                    RM 700.00
                  </p>
                  <p className="mb-1 lg:mb-2 text-md lg:text-lg text-[#EEEEEE]">
                    per roll
                  </p>
                  <p className="text-md lg:text-lg text-[#EEEEEE]">
                    (83ft x 6.5ft)
                  </p>
                </div>
              </div>

            </div>

          </div>
          {/* Artificial Grass ENDS */}
          
        </div>
        {/* Prices Grid ENDS */}

      </div>
    </div>
  );
};

export default SectionPrices;