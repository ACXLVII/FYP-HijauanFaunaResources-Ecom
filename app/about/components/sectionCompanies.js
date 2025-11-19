'use client'

import React from 'react';
import Image from 'next/image';

export default function SectionCompanies() {
    return (
      <div className="bg-[#FFFFFF]">
        <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">

          {/* Heading */}
          <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#101828]">
            Companies we have worked with:
          </h1>

          <div className="flex items-center justify-center">
            <Image src="/images/about/companies/TNB.png" alt="Tenaga National Berhad" width={300} height={300} />
          </div>

        </div>
      </div>
    )
  }
  