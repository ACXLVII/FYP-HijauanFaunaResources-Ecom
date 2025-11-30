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
      background: 'url(/images/home_page/promoBanner.jpg)',
      content: (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 md:gap-3 h-full px-4 md:px-6 lg:px-8">
          {/* Left Side - Title */}
          <div className="relative flex-shrink-0 w-full lg:w-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-2xl">
                WEBSITE OPENING
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-2xl">
                SPECIAL OFFER
              </h2>
            </div>
          </div>

          {/* Right Side - Offer */}
          <div className="flex-1 w-full lg:w-auto flex flex-col items-center lg:items-end gap-2 md:gap-3">
            <div className="text-center lg:text-right">
              <div className="flex flex-col items-center lg:items-end gap-0.5 md:gap-1">
                <div className="flex flex-col md:flex-row items-center lg:items-end gap-1 md:gap-2">
                  <span className="text-white text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-wide">
                    BUY ANY GRASS
                  </span>
                  <span className="text-yellow-400 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-none drop-shadow-lg">
                    FREE
                  </span>
                </div>
                <span className="text-white text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wide">
                  PLANTS & ACCESSORIES
                </span>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-white text-xs md:text-sm lg:text-base font-medium">
                LIMITED TIME OFFER - WHILE STOCKS LAST
              </p>
            </div>
          </div>
        </div>
      ),
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
      <div className="h-[60vh] lg:h-[70vh]">
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  textShadow: '0 0 10px rgba(0,0,0,0.7)',
                }}
              >
              <div className={`h-[75vh] lg:h-[70vh] w-[75vw] lg:w-[80vw] ${slide.id === 1 ? 'bg-black/10' : 'bg-[#000000]/70'}`}>
                {slide.content}
              </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SectionWelcome;