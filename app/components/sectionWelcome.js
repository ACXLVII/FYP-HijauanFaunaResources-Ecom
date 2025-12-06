'use client';

import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const SectionWelcome = () => {
  const slides = [
    {
      id: 1,
      background: 'url(/images/home_page/promoBanner.png)',
      content: null, // Remove CSS text since it's in the PNG
    },
    {
      id: 2,
      background: 'url(/images/home_page/welcome/slide1.jpg)',
      content: (
        <div className="flex flex-col justify-center px-4 lg:px-8 items-center h-full">
          <h1 className="mb-4 lg:mb-8 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Welcome to Hijauan Fauna Resources
          </h1>
          <p className="mb-4 lg:mb-8 text-center text-lg lg:text-2xl text-[#EEEEEE]">
            Your one stop shop for landscaping needs.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      background: 'url(/images/home_page/welcome/slide2.png)',
      content: (
        <div className="flex flex-col justify-center px-4 lg:px-8 items-center h-full">
          <h1 className="mb-4 lg:mb-8 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Live & Artificial Grass Installation
          </h1>
          <p className="mb-4 lg:mb-8 text-center text-lg lg:text-2xl text-[#EEEEEE]">
            Enhance your outdoor space with premium grass solutions.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      background: 'url(/images/home_page/welcome/slide3.jpg)',
      content: (
        <div className="flex flex-col justify-center px-4 lg:px-8 items-center h-full">
          <h1 className="mb-4 lg:mb-8 font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Custom Lanscaping Services
          </h1>
          <p className="mb-4 lg:mb-8 text-center text-lg lg:text-2xl text-[#EEEEEE]">
            Design your dream garden with our tailored landscaping services.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      background: 'url(/images/home_page/welcome/slide4.png)',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-4 lg:px-8">
          <h1 className="mb-4 lg:mb-8 font-bold text-center text-3xl lg:text-4xl text-[#FFFFFF]">
            Lawncare and Maintenance
          </h1>
          <p className="mb-4 lg:mb-8 text-center text-lg lg:text-2xl text-[#EEEEEE]">
            Keep your yard healthy with our professional maintenance services.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="relative">
      <div 
        className="w-full"
        style={{
          aspectRatio: '851 / 315', // Match new promoBanner.png dimensions (2.7:1 ratio)
          minHeight: '300px', // Fallback for older browsers
        }}
      >
        <Swiper
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          effect="fade"
          pagination={{
            clickable: true,
            type: 'bullets',
          }}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full">
              <div
                className="flex items-center justify-center h-full w-full"
                style={{
                  backgroundImage: slide.background,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                {slide.content && (
                  <div className={`w-full max-w-7xl mx-auto px-4 lg:px-8 ${slide.id === 1 ? '' : 'bg-[#000000]/70'}`}>
                    {slide.content}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SectionWelcome;