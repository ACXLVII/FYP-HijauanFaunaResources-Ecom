'use client'

import React from 'react';

export default function SectionHeading() {
  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
        
        {/* Heading */}
        <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
          Tips
        </h1>

        {/* Text */}
        <p className="text-balance text-md lg:text-lg text-[#4A5565]">
          Sage advice for your sages.
        </p>
        
      </div>
    </div>
  )
}