'use client'

import React from "react";

export default function SectionContent() {
  const [showOverlay, setShowOverlay] = React.useState(false);

  return (
    <div className="bg-[#000000]/70 h-[calc(100vh-5rem)]">
      <div className="h-full max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">

        {/* Button Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 h-full">
          
          {/* Grass Button BEGINS */}
          <div className="relative">
            <div
              className={`relative overflow-hidden h-full w-full rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99${
                showOverlay ? ' opacity-0' : ''
              }`}
              style={{
                backgroundImage: "url('/images/shop/grass.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
              onClick={() => setShowOverlay(true)}
              role="button"
              tabIndex={0}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "rgba(0, 0, 0, 0.7)",
                  clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 50%)"
                }}
              />
              <h1 className="absolute flex items-start top-2 lg:top-3 left-2 lg:left-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                Grass
              </h1>
            </div>
            
            {/* Grass Split Overlay */}
            {showOverlay && (
              <>
                <div
                  className="fixed inset-0 z-1 bg-transparent"
                  onClick={() => setShowOverlay(false)}
                /> {/* Backdrop for outside click to close overlay. */}
                <div className="absolute inset-0 z-2 h-full w-full rounded-lg lg:rounded-xl">
                  
                  {/* Live */}
                  <a href="/shop/live_grass">
                    <div
                      className="absolute inset-0 rounded-t-lg lg:rounded-t-xl cursor-pointer transition hover:scale-101 active:scale-99"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 75%)",
                        backgroundImage: "url('/images/shop/LiveGrassTexture.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "multiply"
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-[#000000]/70 rounded-t-lg lg:rounded-t-xl"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 12.5%, 0 50%)" }}
                      />
                      <h1 className="absolute flex items-start top-2 lg:top-3 left-2 lg:left-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                        Live
                      </h1>
                    </div>
                  </a>

                  {/* Artificial */}
                  <a href="/shop/artificial_grass">
                    <div
                      className="absolute inset-0 rounded-b-lg lg:rounded-b-xl cursor-pointer transition hover:scale-101 active:scale-99"
                      style={{
                        clipPath: "polygon(0 75%, 100% 25%, 100% 100%, 0 100%)",
                        backgroundImage: "url('/images/shop/ArtificialGrassTexture.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "multiply"
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-[#000000]/70 rounded-b-lg lg:rounded-b-xl"
                        style={{ clipPath: "polygon(0 87.5%, 100% 50%, 100% 100%, 0 100%)" }}
                      />
                      <h1 className="absolute flex items-start bottom-2 lg:bottom-3 right-2 lg:right-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
                        Artificial
                      </h1>
                    </div>
                  </a>

                </div>
              </>
            )}
          </div>
          {/* Grass Button ENDS */}

          {/* Plants Button BEGINS */}
          <div
            className="relative overflow-hidden rounded-lg lg:rounded-xl shadow-lg active:shadow-none cursor-pointer transition hover:scale-101 active:scale-99"
            style={{
              backgroundImage: "url('/images/shop/plants.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => window.location.href = '/shop/plants'}
            role="button"
            tabIndex={0}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 50%)"
              }}
            />
            <h1 className="absolute flex items-start top-2 lg:top-3 left-2 lg:left-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Plants
            </h1>
          </div>
          {/* Plants Button ENDS */}

          {/* Rocks Button BEGINS */}
          <div
            className="relative overflow-hidden rounded-lg lg:rounded-xl cursor-pointer transition hover:scale-101 active:scale-99 active:opacity-50"
            style={{
              backgroundImage: "url('/images/shop/rocks.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => window.location.href = '/shop/rocks'}
            role="button"
            tabIndex={0}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 50%)"
              }}
            />
            <h1 className="absolute flex items-start top-2 lg:top-3 left-2 lg:left-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Rocks
            </h1>
          </div>
          {/* Rocks Button ENDS */}
          
          {/* Others Button BEGINS */}
          <div
            className="relative overflow-hidden rounded-lg lg:rounded-xl cursor-pointer transition hover:scale-101 active:scale-99 active:opacity-50"
            style={{
              backgroundImage: "url('/images/shop/others.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => window.location.href = '/shop/other_items'}
            role="button"
            tabIndex={0}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 50%)"
              }}
            />
            <h1 className="absolute flex items-start top-2 lg:top-3 left-2 lg:left-3 font-bold tracking-tight text-2xl lg:text-3xl text-[#FFFFFF]">
              Others
            </h1>
          </div>
          {/* Others Button ENDS */}

        </div>
        {/* Button Grid Ends */}

      </div>
    </div>
  )
}