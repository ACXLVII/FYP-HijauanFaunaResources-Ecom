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
    category: 'Landscaping',
    title: 'Residential Garden Transformation',
  },
  {
    id: '2',
    imageSrc: '/images/home_page/results/image2.jpg',
    imageAlt: 'Our Results',
    category: 'Grass Installation',
    title: 'Premium Lawn Installation',
  },
  {
    id: '3',
    imageSrc: '/images/home_page/results/image3.jpg',
    imageAlt: 'Our Results',
    category: 'Artificial Grass',
    title: 'Commercial Space Design',
  },
  {
    id: '4',
    imageSrc: '/images/home_page/results/image4.jpg',
    imageAlt: 'Our Results',
    category: 'Maintenance',
    title: 'Garden Maintenance Service',
  },
  {
    id: '5',
    imageSrc: '/images/home_page/results/image5.jpg',
    imageAlt: 'Our Results',
    category: 'Landscaping',
    title: 'Outdoor Living Space',
  },
  {
    id: '6',
    imageSrc: '/images/home_page/results/image6.jpg',
    imageAlt: 'Our Results',
    category: 'Grass Installation',
    title: 'Modern Landscape Design',
  },
]
    
export default function SectionResults() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="bg-black/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">

        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-8 lg:mb-16">
          <h1 
            className="p-2 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]"
            style={{ textShadow: '4px 4px 12px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)' }}
          >
            Work That Drives Results
          </h1>
        </div>

        {/* Results Grid - Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white/85 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(category)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  className="object-cover w-full h-full transition-all duration-300"
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  width={800}
                  height={600}
                />
              </div>
              
              {/* Card Content */}
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-[#101828] line-clamp-2">
                  {category.title}
                </h3>
              </div>
            </div>
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