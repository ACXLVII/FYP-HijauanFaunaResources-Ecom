'use client'

import React from 'react';

//Icon Imports
import {
  GiWateringCan,
  GiGrass, 
  GiFertilizerBag,
  GiSquare,
  GiCalendar
} from 'react-icons/gi';

// Icon Map
const IconMap = {
  GiWateringCan,
  GiGrass,
  GiFertilizerBag,
  GiSquare,
  GiCalendar,
};

// Icon Renderer
function renderIcon(iconName, className = "") {
  if (!iconName || !IconMap[iconName]) return null;
  const IconComponent = IconMap[iconName];
  return <IconComponent className={className} />;
}

const faqs = [
  {
    question: 'Water Early or Late for Live Grass',
    answer:
      'Water your lawn during the early morning or evening to prevent quick evaporation and keep the roots hydrated.',
    icon: 'GiWateringCan',
  },
  {
    question: 'Mow Smart Not Short',
    answer:
      'Cutting your grass too short can stress the lawn. Leave it slightly longer to protect the soil and prevent weed growth.',
      icon: 'GiGrass',
  },
  {
    question: 'Feed Your Lawn',
    answer:
      'Choose the right fertilizer based on your grass type and apply it during the right season for stronger growth and richer color.',
      icon: 'GiFertilizerBag',
  },
  {
    question: 'Edge Your Lawn for a Clean Look',
    answer:
      'Defined edges around your lawn make a big difference in appearance and give your yard a professionally maintained feel.',
      icon: 'GiSquare',
  },
  {
    question: 'Book Regular Maintenance',
    answer:
      'Consistent care keeps your lawn in top shape. A regular maintenance plan saves time and ensures your grass stays green and lush.',
      icon: 'GiCalendar',
  },
  // More questions...
]

export default function SectionTipsGrass() {
  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
          
          {/* Left Column */}
          <div className="lg:col-span-5 mb-4 lg:mb-0">
            <h2 className="mb-2 lg:mb-4 font-bold tracking-tight text-3xl lg:text-4xl text-[#101828]">
              Grass Care Tips
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