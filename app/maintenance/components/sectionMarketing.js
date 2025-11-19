'use client'

import React from 'react';
import Image from 'next/image';

export default function SectionMarketing() {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Intro BEGINS */}
        <div className="flex flex-col items-center justify-center mb-16 lg:mb-32">
          <h1 className="mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-4xl lg:text-5xl text-[#FFFFFF]">
            Let Us Handle the Hard Work
          </h1>
          <p className="p-2 bg-[#000000]/70 text-center text-lg lg:text-xl text-[#EEEEEE]">
            Keep your garden looking its best all year round with expert care, reliable service, and worry-free upkeep.
          </p>
        </div>
        {/* Intro ENDS */}

        {/* Feature Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-16">
          
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/maintenance/marketing/feature1.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Professional Care
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                Our expert team treats your garden like it’s their own. We use the right tools, the right techniques, and show up on time. Whether it’s a tidy-up or ongoing
                maintenance, we deliver quality service that brings out the best in your green space.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/maintenance/marketing/feature2.jpg"
              alt="Live Grass"
              className="order-1 lg:order-2 object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="order-2 lg:order-1 lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-center text-2xl lg:text-3xl text-[#FFFFFF]">
                Clean, Clear, and Satisfaction Guaranteed
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                We believe your garden should always look its best and your satisfaction comes first. From clearing debris to perfecting edges, we leave your outdoor space looking
                fresh and tidy. Not fully satisfied after we’re done? Just give us a call, and we’ll come back to make it right ! No extra charge.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/maintenance/marketing/feature3.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Flexible Care Plans 
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                Every outdoor space has its own rhythm, and we’re here to match it. Whether you need regular weekly upkeep or occasional seasonal care, our customizable maintenance
                plans are built around your schedule and budget. Enjoy consistent, high-quality service on your terms.
              </p>
            </div>
          </div>
        
        </div>

      </div>
    </div>
  )
}