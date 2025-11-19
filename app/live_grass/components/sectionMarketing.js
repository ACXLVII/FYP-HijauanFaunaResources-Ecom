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
            Grow Real. Live Fresh.
          </h1>
          <p className="p-2 bg-[#000000]/70 text-center text-lg lg:text-xl text-[#EEEEEE]">
            Feel the real texture and cooling comfort of healthy, living grass beneath every step.
          </p>
        </div>
        {/* Intro ENDS */}

        {/* Feature Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          
          {/* Feature 1 */}
          <div className="">
            <Image
              src="/images/live_grass/marketing/feature1.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Authentic Green, Genuine Appeal
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Transform your lawn into a living masterpiece. Our lush live grass brings vibrant color and a naturally soft texture that adds timeless charm to any space because
              nothing compares to the real thing.

            </p>
          </div>

          {/* Feature 2 */}
          <div className="">
            <Image
              src="/images/live_grass/marketing/feature2.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Your Daily Dose of Green
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Turn your yard into a peaceful retreat with soft, vibrant live grass. Whether it’s a quiet coffee outside or a sunset unwind, enjoy the calm of nature right at
              your doorstep.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="">
            <Image
              src="/images/live_grass/marketing/feature3.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full mb-2 lg:mb-4 rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <h2 className="inline-block mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Premium Look, Prestige Feel
            </h2>
            <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
              Elevate your outdoor space with live grass that speaks elegance. Its rich texture and vibrant color add a premium touch to your garden and perfect for homes that
              value natural beauty with a touch of class.
            </p>
          </div>
          
        </div>
        {/* Marketing Grid ENDS */}
        
      </div>
    </div>
  )
}