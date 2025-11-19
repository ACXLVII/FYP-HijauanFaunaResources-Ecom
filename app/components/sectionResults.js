'use client'

import React, { useState } from 'react'
import Image from 'next/image';

// Icon Imports
import { IoCloseOutline } from "react-icons/io5";

const categories = [
  {
    id: '1',
    imageSrc: '/images/home_page/results/image1.jpg',
    imageAlt: 'Our Results',
  },
  {
    id: '2',
    imageSrc: '/images/home_page/results/image2.jpg',
    imageAlt: 'Our Results',
  },
  {
    id: '3',
    imageSrc: '/images/home_page/results/image3.jpg',
    imageAlt: 'Our Results',
  },
  {
    id: '4',
    imageSrc: '/images/home_page/results/image4.jpg',
    imageAlt: 'Our Results',
  },
  {
    id: '5',
    imageSrc: '/images/home_page/results/image5.jpg',
    imageAlt: 'Our Results',
  },
  {
    id: '6',
    imageSrc: '/images/home_page/results/image6.jpg',
    imageAlt: 'Our Results',
  },
]
    
export default function SectionResults() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="bg-black/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">

        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-8 lg:mb-16">
          <h1 className="p-2 bg-[#000000]/70 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Our Results
          </h1>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedImage(category)}
              className="overflow-hidden rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
            >
              <Image
                className="object-cover aspect-4/3 w-full"
                src={category.imageSrc}
                alt={category.imageAlt}
                width={800}
                height={600}
              />
            </button>
          ))}
        </div>

        {/* Modal Overlay */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-0 right-0 text-5xl text-[#FFFFFF] active:text-[#E1C46A]"
                onClick={() => setSelectedImage(null)}
              >
                <IoCloseOutline />
              </button>
              <Image
                src={selectedImage.imageSrc}
                alt={selectedImage.imageAlt}
                className="object-contain max-h-[90vh] max-w-[90vw] rounded-lg"
                width={800}
                height={600}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}