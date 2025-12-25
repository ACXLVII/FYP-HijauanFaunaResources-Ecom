'use client'

import React from 'react';
import Image from 'next/image';

export default function SectionCompanies() {
    return (
      <>
        {/* Heading - Outside the white box */}
        <div className="bg-[#000000]/50">
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto pt-8 lg:pt-12 pb-2 lg:pb-4">
            <h1 
              className="mb-2 lg:mb-4 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]"
              style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
            >
              Companies we have worked with:
            </h1>
          </div>
        </div>

        {/* White container with logos */}
        <div className="bg-[#FFFFFF]">
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto pt-4 lg:pt-6 pb-8 lg:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-center justify-items-center">
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <Image src="/images/about/companies/TNB.png" alt="Tenaga National Berhad" width={300} height={300} className="object-contain w-full h-full" unoptimized />
              </div>
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <Image src="/images/about/companies/EcoGrandeur.png" alt="Eco Grandeur" width={300} height={300} className="object-contain w-full h-full" unoptimized />
              </div>
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <Image src="/images/about/companies/IramaPerdana.png" alt="Irama Perdana" width={300} height={300} className="object-contain w-full h-full" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  