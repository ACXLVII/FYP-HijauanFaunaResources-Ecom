'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/app/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';

export default function SectionReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedImages, setExpandedImages] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'Review');
        
        // Try to get reviews with timestamp ordering, fallback to no ordering if index doesn't exist
        let querySnapshot;
        try {
          const q = query(reviewsRef, orderBy('timestamp', 'desc'));
          querySnapshot = await getDocs(q);
        } catch (orderError) {
          // If ordering fails (likely missing index), fetch without ordering
          console.warn('Could not order by timestamp, fetching without order:', orderError);
          querySnapshot = await getDocs(reviewsRef);
        }
        
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reviewsData.push({
            id: doc.id,
            ...data,
          });
        });
        
        // Sort manually if timestamp exists (fallback)
        if (reviewsData.length > 0 && reviewsData[0].timestamp) {
          reviewsData.sort((a, b) => {
            const aTime = a.timestamp?.toMillis?.() || a.timestamp?.seconds || 0;
            const bTime = b.timestamp?.toMillis?.() || b.timestamp?.seconds || 0;
            return bTime - aTime; // Descending order
          });
        }
        
        console.log('Fetched reviews:', reviewsData.length);
        setReviews(reviewsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(`Failed to load reviews: ${err.message}. Please check the browser console for details.`);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleImageExpansion = (reviewId, imageIndex) => {
    const key = `${reviewId}-${imageIndex}`;
    setExpandedImages((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#000000]/50">
        <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          <div className="text-center text-lg text-[#4A5565]">
            Loading reviews...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#000000]/50">
        <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          <div className="text-center text-lg text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0 && !loading && !error) {
    return (
      <div className="bg-[#000000]/50">
        <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          <div className="max-w-2xl mx-auto p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg text-center">
            <p className="text-md lg:text-lg text-[#4A5565] mb-4">
              No reviews yet. Be the first to share your experience!
            </p>
            <a 
              href="/review" 
              className="inline-block px-6 py-3 bg-[#498118] text-white rounded-lg hover:bg-[#3d6f14] transition-colors"
            >
              Write a Review
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
        <div className="space-y-6 lg:space-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="max-w-2xl mx-auto p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-lg lg:text-xl text-[#101828]">
                    {review.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm lg:text-md text-[#4A5565]">
                    {formatDate(review.date)}
                  </p>
                </div>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`size-5 lg:size-6 ${
                        star <= (review.rating || 0)
                          ? 'text-[#FFD700]'
                          : 'text-[#CCCCCC]'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm lg:text-md text-[#4A5565]">
                    ({review.rating || 0}/5)
                  </span>
                </div>
              </div>

              {/* Description */}
              {review.description && (
                <div className="mb-4">
                  <p className="text-md lg:text-lg text-[#4A5565] whitespace-pre-wrap">
                    {review.description}
                  </p>
                </div>
              )}

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {review.images.map((image, index) => {
                      const isExpanded = expandedImages[`${review.id}-${index}`];
                      return (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => toggleImageExpansion(review.id, index)}
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#AAAAAA] hover:border-[#C39533] transition-colors">
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          {isExpanded && (
                            <div
                              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
                              onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                  toggleImageExpansion(review.id, index);
                                }
                              }}
                            >
                              <div className="relative max-w-[90vw] max-h-[90vh]">
                                <Image
                                  src={image}
                                  alt={`Review image ${index + 1} - expanded`}
                                  width={1200}
                                  height={1200}
                                  className="object-contain max-w-full max-h-[90vh] rounded-lg"
                                  unoptimized
                                />
                                <button
                                  onClick={() => toggleImageExpansion(review.id, index)}
                                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                                  aria-label="Close image"
                                >
                                  <svg
                                    className="size-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

