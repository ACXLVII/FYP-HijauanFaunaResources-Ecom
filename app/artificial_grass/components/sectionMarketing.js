'use client'

import React from 'react';
import Image from 'next/image';

export default function SectionMarketing() {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Intro BEGINS */}
        <div className="flex flex-col items-center justify-center mb-16 lg:mb-32">
          <h1 className="mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-center text-4xl lg:text-5xl text-[#FFFFFF]">
            Perfect Grass, Zero Effort.
          </h1>
          <p className="p-2 bg-[#000000]/70 text-center text-lg lg:text-xl text-[#EEEEEE]">
            [something about artificial grass] Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        {/* Intro ENDS */}

        {/* Feature Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          
          {/* Feature 1 */}
          <div className="">
            <Image
              src="/images/artificial_grass/marketing/feature1.jpg"
              alt="Artificial Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            {/* <img
              src="/images/artificial_grass/marketing/feature1.jpg"
              alt="Artificial Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
            /> */}
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Green, All Year Round
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Enjoy perfect, vibrant grass 365 days a year! No mowing, no watering, no worries. Our artificial grass stays lush and beautiful in any weather, for a lawn that
              always looks its best.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="">
            <img
              src="/images/artificial_grass/marketing/feature2.jpg"
              alt="Artificial Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
            />
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Low Maintenance, High Impact
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Say goodbye to muddy mess and hello to hassle-free beauty. With artificial grass, your outdoor space stays clean, green, and guest ready with all minimal upkeep.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="">
            <img
              src="/images/artificial_grass/marketing/feature3.jpg"
              alt="Artificial Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
            />
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Style That Lasts
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Whether it’s your backyard, balcony, or business front, artificial grass brings long-lasting style and comfort. It’s the smart choice for modern living with a
              natural look.
            </p>
          </div>
          
        </div>
        {/* Marketing Grid ENDS */}
        
      </div>
    </div>
  )
}