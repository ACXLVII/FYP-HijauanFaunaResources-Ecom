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
          <h1 
            className="p-2 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]"
            style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
          >
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
            <h1 
              className="w-fit mb-4 lg:mb-8 p-2 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
              style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
            >
                Live Grass
            </h1>
            <p 
              className="w-fit mb-2 lg:mb-4 p-2 font-bold text-md lg:text-lg text-[#EEEEEE]"
              style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
            >
                Starting from:
            </p>

            {/* Price Grid*/}
            <div className="grid grid-cols-1">
            
              {/* Per Tile */}
              <div className="bg-white/80 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-md overflow-hidden grid grid-cols-3">
                <div className="flex items-center justify-center col-span-1 p-1 lg:p-2">
                  <TbRulerMeasure className="text-3xl lg:text-4xl text-[#000000]" />
                </div>
                <div className="col-span-2 p-1 lg:p-2">
                  <p className="mb-0.5 lg:mb-1 font-bold text-base lg:text-lg text-[#000000]">
                    RM 1.60
                  </p>
                  <p className="mb-0.5 lg:mb-1 text-sm lg:text-base text-[#000000]">
                    per Tile
                  </p>
                  <p className="text-sm lg:text-base text-[#000000]">
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
            <h1 
              className="w-fit mb-4 lg:mb-8 p-2 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]"
              style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
            >
                Artificial Grass
            </h1>
            <p 
              className="w-fit mb-2 lg:mb-4 p-2 font-bold text-md lg:text-lg text-[#EEEEEE]"
              style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
            >
                Starting from:
            </p>

            {/* Price Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
              {/* Per Square Feet */}
              <div className="bg-white/80 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-md overflow-hidden grid grid-cols-3">
                <div className="flex items-center justify-center col-span-1 p-1 lg:p-2">
                  <TbRuler className="text-3xl lg:text-4xl text-[#000000]" />
                </div>
                <div className="col-span-2 p-1 lg:p-2">
                  <p className="mb-0.5 lg:mb-1 font-bold text-base lg:text-lg text-[#000000]">
                    RM 3.10
                  </p>
                  <p className="mb-0.5 lg:mb-1 text-sm lg:text-base text-[#000000]">
                    per square feet
                  </p>
                  <p className="text-sm lg:text-base text-[#000000]">
                    (1ft x 1ft)
                  </p>
                </div>
              </div>

              {/* Per Roll */}
              <div className="bg-white/80 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-md overflow-hidden grid grid-cols-3">
                <div className="flex items-center justify-center col-span-1 p-1 lg:p-2">
                  <GiBandageRoll className="text-3xl lg:text-4xl text-[#000000]" />
                </div>
                <div className="col-span-2 p-1 lg:p-2">
                  <p className="mb-0.5 lg:mb-1 font-bold text-base lg:text-lg text-[#000000]">
                    RM 1400.00
                  </p>
                  <p className="mb-0.5 lg:mb-1 text-sm lg:text-base text-[#000000]">
                    per roll
                  </p>
                  <p className="text-sm lg:text-base text-[#000000]">
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