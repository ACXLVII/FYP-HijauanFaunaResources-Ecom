'use client';

import React from 'react';

const SectionPromoBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Main Banner Container */}
      <div 
        className="relative min-h-[100px] md:min-h-[120px] lg:min-h-[140px] flex items-center justify-center px-4 md:px-6 lg:px-8 py-3 md:py-4"
        style={{
          backgroundImage: 'url(/images/home_page/promoBanner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 md:gap-3">
          {/* Left Side - Title */}
          <div className="relative flex-shrink-0 w-full lg:w-auto">
            {/* Grand Opening Text */}
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
            {/* Offer Text - Redesigned */}
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

            {/* Promotion Details Text */}
            <div className="text-center lg:text-right">
              <p className="text-white text-xs md:text-sm lg:text-base font-medium">
                LIMITED TIME OFFER - WHILE STOCKS LAST
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionPromoBanner;

