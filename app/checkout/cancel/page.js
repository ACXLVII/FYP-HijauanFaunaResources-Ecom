'use client'

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

//Icon Imports
import { TbShoppingBagX } from "react-icons/tb";

// Cart Hook
import { useCart } from '@/app/hooks/useCart';

export default function CheckoutCancel() {
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    // Optional: You might want to track cancellation analytics here
    console.log('Payment was cancelled by user');
  }, []);

  const handleReturnToCart = () => {
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    router.push('/shop');
  };

  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21">

        <div className="bg-[#000000]/50">
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          
            <div className="overflow-hidden max-w-fit mx-auto p-8 lg:p-16 bg-white rounded-lg lg:rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center">
                
                {/* Payment Cancelled */}
                <TbShoppingBagX className="mb-4 lg:mb-8 size-16 lg:size-24 text-[#dc2626]" />
                <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-2xl lg:text-3xl text-[#101828]">
                  Payment Cancelled
                </h1>
                <p className="text-center text-md lg:text-lg text-[#4A5565] mb-6 lg:mb-8">
                  Your payment was cancelled.<br/>No charges have been made to your account.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={handleReturnToCart}
                    className="flex-1 bg-[#498118] hover:bg-[#3d6b14] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Return to Cart
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 lg:mt-8 text-center">
                  <p className="text-sm text-[#6B7280]">
                    Your items are still in your cart if you'd like to try again.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
