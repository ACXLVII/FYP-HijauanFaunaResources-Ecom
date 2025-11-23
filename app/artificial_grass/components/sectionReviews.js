'use client'

import React, { useState } from "react";
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    images: [
      {
        before: "/images/artificial_grass/review1/BeforeArtificial1.jpg",
        after: "/images/artificial_grass/review1/AfterArtificial1.jpg",
      }
    ],
    name: "Customer Name",
    caption: "Customer review text will appear here. Update this with actual customer feedback.",
    date: "DD/MM/YYYY",
  },
  {
    id: 2,
    images: [
      {
        before: "/images/artificial_grass/review2/BeforeArtificial2.jpg",
        after: "/images/artificial_grass/review2/AfterArtificial2.jpg",
      }
    ],
    name: "Customer Name",
    caption: "Customer review text will appear here. Update this with actual customer feedback.",
    date: "DD/MM/YYYY",
  },
]

function ReviewCard({ review }) {
  const [view, setView] = useState("before");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const images = review.images[0];

  return (
    <div>

      {/* Image Switch Buttons BEGINS */}
      <div className="grid grid-cols-2">
        
        {/* Before */}
        <button
          onClick={() => {
            setView("before");
            if (showOverlay) setShowOverlay(false);
          }}
          className={`p-2 lg:p-4 text-md lg:text-lg rounded-t-lg lg:rounded-t-xl transition ${
            view === "before"
              ? "bg-[#C39533] text-white border-2 border-[#C39533]"
              : "bg-[#FFFFFF] text-[#C39533] border-2 border-[#C39533] cursor-pointer"
          }`}
        >
          Before
        </button>

        {/* After */}
        <button
          onClick={() => {
            setView("after");
            if (showOverlay) setShowOverlay(false);
          }}
          className={`px-4 py-2 text-md lg:text-lg rounded-t-lg lg:rounded-t-xl transition ${
            view === "after"
              ? "bg-[#C39533] text-white border-2 border-[#C39533]"
              : "bg-[#FFFFFF] text-[#C39533] border-2 border-[#C39533] cursor-pointer"
          }`}
        >
          After
        </button>

      </div>
      {/* Image Switch Button ENDS */}

      {/* Images BEGINS */}
      <div className="relative flex items-center justify-center border-x-2 border-[#C39533]">
        <div
          className="w-full h-full overflow-hidden group relative"
          style={{ cursor: showOverlay ? "default" : "zoom-in" }}
          onMouseMove={e => {
            if (!showOverlay && window.innerWidth >= 1024) {
              const container = e.currentTarget;
              const img = container.querySelector("img");
              if (img) {
                const rect = container.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                img.style.transformOrigin = `${x}% ${y}%`;
              }
            }
          }}
          onMouseLeave={e => {
            const img = e.currentTarget.querySelector("img");
            if (img) {
              img.style.transformOrigin = "50% 50%";
            }
          }}
        >
          <Image
            src={images[view]}
            alt={view}
            className="object-cover aspect-video w-full transition-transform duration-500 group-hover:scale-200 lg:group-hover:scale-200"
            width={800}
            height={600}
            style={{ pointerEvents: showOverlay ? "none" : "auto" }}
            onClick={() => {
              if (window.innerWidth < 1024) setShowImageOverlay(true);
            }}
          />
          {/* Review Overlay */}
          {showOverlay && (
            <div className="absolute flex flex-col items-center justify-center z-1 inset-0 bg-black/50 bg-opacity-70">
              <div className="bg-black/50 p-6 w-full h-full max-w-full max-h-full flex items-center justify-center shadow-lg">
                <div className="max-w-xs w-full text-center">
                  <p className="mb-2 lg:mb-4 font-bold text-lg lg:text-xl text-[#FFFFFF]">{'"'}{review.caption}{'"'}</p>
                  <p className="text-md lg:text-lg text-[#CCCCCC]">{'- '}{review.name}{', '}{review.date}</p>
                </div>
              </div>
            </div>
          )}
          {/* Mobile Large Image Overlay */}
          {showImageOverlay && (
            <div
              className="fixed inset-0 z-100 flex items-center justify-center bg-black/80"
              onClick={() => setShowImageOverlay(false)}
            >
              <Image
                src={images[view]}
                alt={view}
                className="max-h-full max-w-full shadow-lg"
                width={800}
                height={600}
              />
            </div>
          )}
        </div>
      </div>
      {/* Images END */}

      {/* Review Button */}
      <div className="flex flex-col">
        <button
          onClick={() => setShowOverlay(v => !v)}
          className={`p-2 lg:p-4 text-md lg:text-lg rounded-b-lg lg:rounded-b-xl transition ${
            showOverlay
              ? "bg-[#C39533] text-white border-2 border-[#C39533]"
              : "bg-[#FFFFFF] text-[#C39533] border-2 border-[#C39533] cursor-pointer"
          }`}
        >
          Customer Review
        </button>
      </div>
      
    </div>
  );
}

export default function SectionReviews() {
  const [view, setView] = useState("before");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);

  
  return (
    <div className="bg-white">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">

        {/* Heading */}
        <h1 className="mb-8 lg:mb-16 font-bold tracking-tight text-balance text-3xl lg:text-4xl text-[#101828]">
          Customer Feedback
        </h1>

        {/* Review Grid BEGINS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        {/* Review Grid ENDS */}

      </div>
    </div>
  );
}

