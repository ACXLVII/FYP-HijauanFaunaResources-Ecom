'use client'

import React from 'react';
import Image from 'next/image';

export default function SectionIntro() {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        {/* Intro BEGINS */}
        <div className="flex flex-col items-center justify-center mb-16 lg:mb-32">
          <h1 className="mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-center text-4xl lg:text-5xl text-[#FFFFFF]">
            We are <span className="text-[#498118]">Hijauan Fauna Resources</span>
          </h1>
          <p className="p-2 bg-[#000000]/70 text-center text-lg lg:text-xl text-[#EEEEEE]">
            Dedicated to bring <span className="text-[#56BB00]">nature</span> closer to <span className="text-[#C39533]">you</span>.
          </p>
        </div>
        {/* Intro ENDS */}

        {/* Feature Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-16">
          
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/about/weDaBest.jpg"
              alt="Hijauan Fauna Resources"
              width={800}
              height={600}
              className="object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
            />
            <div className="lg:flex lg:flex-col lg:justify-center">
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                At Hijauan Fauna, we are passionate about turning outdoor spaces into beautiful, functional, and relaxing environments. From custom landscaping and
                reliable maintenance to premium grass solutions in both artificial and live varieties, we help homeowners and businesses create green spaces that suit
                their lifestyle. With a strong focus on quality, care, and customer satisfaction, we make it easy for you to enjoy your garden without the stress.
              </p>
            </div>
          </div>
        
        </div>

      </div>
    </div>
  )
}