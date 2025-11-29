'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import {
  FaChevronLeft
} from "react-icons/fa";

export default function NavigationPanels({
  openPanel,
  setOpenPanel,
  showGrassSplit,
  setShowGrassSplit,
  grassSplitRef,
  navigation,
}) {

  const pathname = usePathname();

  return (
    openPanel && (
      <div
        className="navigation-panel fixed inset-x-10 top-21 z-45 min-h-fit w-fit max-w-[80vw] mx-auto bg-[#FFFFFF] rounded-b-xl shadow-xl transition-all duration-300 ease-out"
      >
        {/* Panel Content BEGINS */}
        {openPanel === 'Services' ? (
          <div className="grid grid-cols-3 gap-8 p-8 overflow-hidden">
            {/* Services Buttons */}
            {navigation.menuItems.find(cat => cat.name === 'Services')?.categories.map((item) =>
              item.name === 'Grass' ? (
                <div
                  key={item.id}
                  className={`relative group ${showGrassSplit ? '' : 'cursor-pointer'}`}
                >
                  <div
                    className={`relative overflow-hidden h-56 rounded-xl shadow-xl transition hover:scale-105 active:scale-95 active:shadow-none ${showGrassSplit ? 'opacity-0' : ''}`}
                    onClick={() => setShowGrassSplit(true)}
                    style={{
                      backgroundImage: `url(${item.imageSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      aspectRatio: '4/3',
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <div className="absolute top-0 flex items-center justify-between w-full p-4 bg-[#000000]/50">
                      <h1 className="font-bold tracking-tight text-3xl text-[#FFFFFF]">
                        {item.name}
                      </h1>
                      <item.icon className="size-8 p-1 text-[#FFFFFF] rounded-full border-2 border-[#FFFFFF]" />
                    </div>
                  </div>
                  {/* Grass Split Overlay */}
                  {showGrassSplit && (
                    <>
                      <div
                        ref={grassSplitRef}
                        className="absolute inset-0 z-39 h-full w-full rounded-xl flex flex-col"
                      >
                        {item.subCategories.map((sub, idx) => (
                          <a
                            href={sub.href}
                            key={sub.id}
                            className=""
                          >
                            <div
                              className={
                                "absolute overflow-hidden inset-0 " +
                                (idx === 0 ? "rounded-t-xl" : "rounded-b-xl") +
                                " transition hover:scale-105 active:scale-95"
                              }
                              style={{
                                clipPath:
                                  idx === 0
                                    ? "polygon(0 0, 100% 0, 100% 50%, 0 50%)"
                                    : "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                                backgroundImage: `url(${sub.imageSrc})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundBlendMode: "multiply",
                              }}
                            >
                              <div className={
                                "flex items-center justify-between w-full p-4 bg-[#000000]/50 " +
                                (idx === 0 ? "absolute top-0 left-0"
                                  : "absolute bottom-0 right-0")
                              }>
                                <h1 className={
                                  "font-bold tracking-tight text-3xl text-[#FFFFFF] " +
                                  (idx === 0 ? "text-left" : "text-right")
                                }>
                                  {sub.name}
                                </h1>
                                {sub.icon && (
                                  <sub.icon className="size-8 p-1 text-[#FFFFFF] rounded-full border-2 border-[#FFFFFF]" />
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <a key={item.id} href={item.href} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-xl hover:scale-105 active:scale-95 active:shadow-none transition">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="object-center object-cover aspect-4/3 h-56 w-full"
                    />
                    <div className="absolute top-0 flex items-center justify-between w-full p-4 bg-[#000000]/50">
                      <h1 className="font-bold tracking-tight text-3xl text-[#FFFFFF]">
                        {item.name}
                      </h1>
                      <item.icon className="size-8 p-1 text-[#FFFFFF] rounded-full border-2 border-[#FFFFFF]" />
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        ) : openPanel === 'Shop' ? (
          <div className="flex p-8">
            <div className="flex flex-row gap-8">
              
              {navigation.menuItems.find(cat => cat.name === 'Shop')?.categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-2">

                  <div className="flex items-center gap-4 p-2">
                    <h1 className="p-1 font-bold tracking-tight text-2xl text-[#101828]">
                      {category.name}
                    </h1>
                    <category.icon className="size-10 p-1 text-[#101828]" />
                  </div>

                  <div className="h-0.25 w-full bg-[#C39533]" />

                  <div className="grid grid-cols-1">
                    {category.subCategories.map((subCategory) => {
                      const isActive = pathname.startsWith(subCategory.href);
                      if (isActive) {
                        return (
                          <a
                            key={subCategory.id}
                            href={subCategory.href}
                            className="group flex items-center justify-between gap-2 p-2"
                          >
                            <h2 className="p-1 text-md text-[#C39533] group-active:text-[#E1C46A] transition-colors duration-200 ease-out">
                              {subCategory.name}
                            </h2>
                            <FaChevronLeft className="size-8 p-1 text-[#C39533] group-active:text-[#E1C46A]" />
                          </a>
                        );
                      }
                      return (
                        <a
                          key={subCategory.id}
                          href={subCategory.href}
                          className="group flex items-center justify-between gap-2 p-2"
                        >
                          <h2 className="p-1 text-md text-[#4A5565] group-hover:text-[#C39533] group-active:text-[#E1C46A] transition-colors duration-200 ease-out">
                            {subCategory.name}
                          </h2>
                          <FaChevronLeft className="size-8 p-1 text-transparent" />
                        </a>
                      );
                    })}
                  </div>
                  
                </div>
              ))}
              
            </div>
          </div>
        ) : null}
        {/* Panel Content ENDS */}
      </div>
    )
  );
}