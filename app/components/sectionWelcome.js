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
      background: 'url(/images/home_page/welcome/slide1.png)',
      content: null, // Text is in the PNG image
    },
    {
      id: 2,
      background: 'url(/images/home_page/welcome/slide2.png)',
      content: null, // Text is in the PNG image
    },
    {
      id: 3,
      background: 'url(/images/home_page/welcome/slide3.png)',
      content: null, // Text is in the PNG image
    },
  ];

  return (
    <section className="relative">
      <div 
        className="w-full"
        style={{
          aspectRatio: '16 / 9', // Standard widescreen aspect ratio for new banners
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
                  <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
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