'use client'

import React from 'react';

//Icon Imports
import {
  GiAnt,
  GiCoalPile,
  GiRecycle,
  GiFlowerPot,
  GiGardeningShears
} from 'react-icons/gi';

// Icon Map
const IconMap = {
  GiAnt,
  GiCoalPile,
  GiRecycle,
  GiFlowerPot,
  GiGardeningShears,
};

// Icon Renderer
function renderIcon(iconName, className = "") {
  if (!iconName || !IconMap[iconName]) return null;
  const IconComponent = IconMap[iconName];
  return <IconComponent className={className} />;
}

const faqs = [
  {
    question: 'Check for Pests Regularly',
    answer:
      'Keep an eye on leaves and stems for signs of pests or disease. Catching problems early helps protect the rest of your garden.',
    icon: 'GiAnt',
  },
  {
    question: 'Use Mulch to Lock in Moisture',
    answer:
      'Adding mulch helps the soil retain moisture, discourages weeds, and keeps your plants cool and healthy.',
      icon: 'GiCoalPile',
  },
  {
    question: 'Rotate Your Plants',
    answer:
      'Changing your planting spots helps maintain soil health and prevents the buildup of plant-specific pests and diseases.',
      icon: 'GiRecycle',
  },
  {
    question: 'Choose the Right Plants for Your Space',
    answer:
      'Consider sunlight, soil, and climate when picking plants to ensure they grow well and look their best in your garden.',
      icon: 'GiFlowerPot',
  },
  {
    question: 'Prune for Health and Shape',
    answer:
      'Regular trimming encourages new growth, helps your plants breathe, and keeps them looking neat and lively.',
      icon: 'GiGardeningShears',
  },
  // More questions...
]

export default function SectionTipsGrass() {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto pb-16 lg:pb-32">
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
          
          {/* Left Column */}
          <div className="lg:col-span-5 mb-4 lg:mb-0">
            <h2 className="mb-2 lg:mb-4 font-bold tracking-tight text-3xl lg:text-4xl text-[#101828]">
              Plant Care Tips
            </h2>
            <p className="text-justify text-md lg:text-lg text-[#4A5565]">
              Need more advice? Reach out to us through{' '}
              <a href="https://wa.me/601127312673" className="font-bold text-[#498118]">
                WhatsApp
              </a>
              .
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7">
            <dl className="space-y-4 lg:space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden flex flex-col p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 border-[#C39533]">
                <div className="flex items-center gap-2 lg:gap-4">
                  {renderIcon(faq.icon, "max-h-fit size-36 lg:size-12 text-[#C39533]")}
                  <div className="min-h-full w-px self-stretch border-l-2 border-[#C39533]" />
                  <div className="">
                    <h3 className="mb-1 lg:mb-2 font-bold tracking-tight text-md lg:text-lg text-[#101828]">
                      {faq.question}
                    </h3>
                    <p className="text-justify text-sm lg:text-md text-[#4A5565]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </dl>
          </div>

        </div>

      </div>
    </div>
  )
}