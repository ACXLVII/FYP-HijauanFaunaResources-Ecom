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
            Design Nature Your Way
          </h1>
          <p className="p-2 bg-[#000000]/70 text-center text-lg lg:text-xl text-[#EEEEEE]">
            Transform your outdoor space into a stunning, personalized landscape that reflects your style and enhances your lifestyle.
          </p>
        </div>
        {/* Intro ENDS */}

        {/* Feature Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-16">
          
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/landscaping/marketing/feature1.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Customized Green Design That Matches Your Lifestyle
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                We believe that every outdoor space should reflect your personality. That’s why we offer fully personalized landscaping designs from neat, modern aesthetics to lush
                tropical vibes. Our design team works closely with you to plan layouts, plant selections, and green zones that enhance both your lifestyle and property value. Whether
                it’s a cozy garden for morning coffee or a bold front yard for a lasting first impression, we shape greenery to suit your vision.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/landscaping/marketing/feature2.jpg"
              alt="Live Grass"
              className="order-1 lg:order-2 object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="order-2 lg:order-1 lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Expert Installation
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                Great landscaping starts with solid groundwork. Our professional team handles everything from soil conditioning and drainage to turf laying, pathway shaping, and
                finishing touches. We use high-quality materials, precise techniques, and years of industry experience to create outdoor spaces that are not only beautiful but also
                durable in any weather.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <Image
              src="/images/landscaping/marketing/feature3.jpg"
              alt="Live Grass"
              className="object-cover aspect-4/3 w-full rounded-lg lg:rounded-xl shadow-lg"
              width={800}
              height={600}
            />
            <div className="lg:flex lg:flex-col lg:justify-center">
              <h2 className="w-fit mb-2 lg:mb-4 p-2 bg-[#000000]/70 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Safe and Family-Friendly Designs
              </h2>
              <p className="p-2 bg-[#000000]/70 text-justify text-md lg:text-lg text-[#EEEEEE]">
                We prioritize safety and comfort in every landscape we create. From non-slip walkways to soft grass areas for kids and pets, our designs are made for real-life use.
                Whether it's playtime, gatherings, or quiet evenings, your outdoor space becomes a secure and welcoming place for the whole family.
              </p>
            </div>
          </div>
        
        </div>

      </div>
    </div>
  )
}