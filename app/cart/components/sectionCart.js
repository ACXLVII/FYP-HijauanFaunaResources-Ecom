'use client'

import React, { useMemo } from 'react';
import Image from 'next/image';

import { useCart } from '@/app/hooks/useCart';

// Icon Imports
import { TbGardenCartOff } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

export default function SectionCart() {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const shipping = 15.00;
  const taxRate = 0.08;
  const totalPrice = useMemo(() => getTotalPrice(), [cart]);
  const tax = totalPrice * taxRate;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 mb-4 lg:mb-0 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">

            <ul role="list" className="grid grid-cols-1 gap-2 lg:gap-4">
              {cart.length === 0 ? (
                <li className="flex flex-col items-center justify-center">
                  <TbGardenCartOff className="mx-auto mb-1 lg:mb-2 size-6 lg:size-8 text-[#4A5565]" />
                  <p className="text-center text-md lg:text-lg text-[#4A5565]">
                    Your cart is empty.
                  </p>
                </li>
              ) : (
                cart.map((product, productIdx) => ( // Product Card
                  <li key={product.cartId || productIdx} className="overflow-hidden flex flex-row p-2 lg:p-4 rounded-md lg:rounded-lg border-2 border-[#C39533]">
                    
                    {/* Product Image */}
                    <div className="overflow-hidden relative aspect-square mr-2 lg:mr-4 rounded-md lg:rounded-lg border-2 border-[#C39533]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 object-cover w-full h-full"
                        width={100}
                        height={100}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="relative flex-1">
                      <div className="flex flex-col justify-between h-full">
                        <div className="">
                          <h2 className="font-bold tracking-tight text-md lg:text-lg text-[#101828]">
                            {product.name}
                          </h2>
                        </div>
                        <div className="">
                          <p className="text-md lg:text-lg text-[#4A5565]">
                            Quantity: <span className="font-bold text-[#C39533]">{product.quantity}</span> {product.sizeType}(s)
                          </p>
                          <p className="text-md lg:text-lg text-[#4A5565]">
                            For: <span className="font-bold text-[#C39533]">{product.requestedArea}</span> sq ft
                          </p>
                          {/* <p className="font-bold tracking-tight text-md lg:text-lg text-[#498118]">
                            RM {parseFloat(product.price).toFixed(2)}
                          </p> */}
                        </div>
                      </div>
                      <button
                        className="absolute flex items-center justify-center top-0 right-0 cursor-pointer"
                        type="button"
                        onClick={() => removeFromCart(productIdx)}
                      >
                        <RxCross2 className="size-6 lg:size-8 text-[#C39533]" />
                      </button>
                      <p className="absolute flex items-center justify-center bottom-0 right-0 font-bold tracking-tight text-md lg:text-lg text-[#498118]">
                        RM {parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>

                  </li>
                ))
              )}
            </ul>

          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
            <h2 className="mb-2 lg:mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
              Cart Summary
            </h2>
            <hr className="border-t-2 border-[#C39533]" />
            <div className="divide-y divide-[#CCCCCC]">
              <div className="flex flex-row items-center justify-between py-2 lg:py-4">
                <p className="text-md lg:text-lg text-[#4A5565]">
                  Items:
                </p>
                <p className="font-bold tracking-tight text-md lg:text-lg text-[#C39533]">
                  {cart.length}
                </p>
              </div>
              {/* <hr className="mb-2 lg:mb-4 border-t border-[#CCCCCC]" /> */}
              <div className="flex flex-row items-center justify-between py-2 lg:py-4">
                <p className="font-bold tracking-tight text-md lg:text-lg text-[#101828]">
                  Subtotal:
                </p>
                <p className="font-bold tracking-tight text-md lg:text-lg text-[#498118]">
                  RM {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = `/checkout`}
              className="w-full p-4 bg-[#498118] font-bold text-md lg:text-lg text-[#FFFFFF] rounded-md lg:rounded-lg shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}