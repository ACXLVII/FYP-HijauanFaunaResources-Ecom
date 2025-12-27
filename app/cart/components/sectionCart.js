'use client'

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';

import { useCart } from '@/app/hooks/useCart';

// Icon Imports
import { TbGardenCartOff } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export default function SectionCart() {
  const { cart, removeFromCart, updateCartItemQuantity, getTotalPrice } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const shipping = 15.00;
  const taxRate = 0.08;
  const totalPrice = useMemo(() => getTotalPrice(), [cart, getTotalPrice]);
  const tax = totalPrice * taxRate;
  const orderTotal = totalPrice + shipping + tax;

  const getSizeType = (sizeType, quantity = 1) => {
    if (!sizeType) return '';
    
    const normalizedType = sizeType.toLowerCase().trim();
    const isPlural = parseInt(quantity) !== 1;
    
    switch (normalizedType) {
      case 'square feet':
      case 'square foot':
      case 'sqft':
        return 'square feet'; // Always plural
      case 'roll':
        return isPlural ? 'rolls' : 'roll';
      case 'unit':
        return isPlural ? 'units' : 'unit';
      case 'ton':
        return isPlural ? 'tons' : 'ton';
      case 'kilogram':
      case 'kg':
        return isPlural ? 'kilograms' : 'kilogram';
      default:
        // Fallback: add 's' if plural and it doesn't already end with 's'
        if (isPlural && !sizeType.endsWith('s')) {
          return `${sizeType}s`;
        }
        return sizeType;
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="bg-[#000000]/50">
        <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
            <div className="lg:col-span-8 mb-4 lg:mb-0 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
              <div className="flex items-center justify-center h-32">
                <p className="text-lg text-[#4A5565]">Loading...</p>
              </div>
            </div>
            <div className="lg:col-span-4 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
              <h2 className="mb-2 lg:mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
                Cart Summary
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <li key={product.cartId || productIdx} className="overflow-hidden flex flex-row gap-2 lg:gap-4 p-2 lg:p-4 rounded-md lg:rounded-lg border-2 border-[#C39533]">
                    
                    {/* Product Image */}
                    <div className="shrink-0 overflow-hidden relative w-20 h-20 lg:w-24 lg:h-24 aspect-square rounded-md lg:rounded-lg border-2 border-[#C39533]">
                      <Image
                        src={typeof product.image === 'string' && product.image ? product.image : (product.image?.src || product.image?.default?.src || '/images/HFRlogo.png')}
                        alt={product.name}
                        className="absolute inset-0 object-cover w-full h-full"
                        width={100}
                        height={100}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* Header: Name and Remove Button */}
                      <div className="flex items-start justify-between gap-2 mb-2 lg:mb-3">
                        <h2 className="font-bold tracking-tight text-md lg:text-lg text-[#101828] truncate flex-1 pr-2">
                          {product.name}
                        </h2>
                        <button
                          className="shrink-0 flex items-center justify-center p-1 hover:bg-[#C39533]/30 active:bg-[#C39533]/40 rounded transition cursor-pointer"
                          type="button"
                          onClick={() => removeFromCart(productIdx)}
                          aria-label="Remove item"
                        >
                          <RxCross2 className="size-5 lg:size-6 text-[#C39533]" />
                        </button>
                      </div>

                      {/* Quantity and Size */}
                      <div className="flex flex-col gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                          <div className="flex items-center gap-0 border-2 border-[#C39533] rounded-md lg:rounded-lg bg-[#FFFFFF]">
                            <button
                              type="button"
                              onClick={() => {
                                const currentQty = parseInt(product.quantity) || 1;
                                if (currentQty === 1) {
                                  // Show confirmation before removing item
                                  const confirmed = window.confirm(
                                    `Are you sure you want to remove "${product.name}" from your cart?`
                                  );
                                  if (confirmed) {
                                    removeFromCart(product.cartId);
                                  }
                                } else {
                                  updateCartItemQuantity(product.cartId, currentQty - 1);
                                }
                              }}
                              className="p-1.5 lg:p-2 hover:bg-[#C39533]/20 active:bg-[#C39533]/30 transition rounded-l-md lg:rounded-l-lg"
                              aria-label="Decrease quantity"
                            >
                              <AiOutlineMinus className="size-4 lg:size-5 text-[#C39533]" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                if (newQty > 0) {
                                  updateCartItemQuantity(product.cartId, newQty);
                                }
                              }}
                              onBlur={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                if (newQty < 1) {
                                  updateCartItemQuantity(product.cartId, 1);
                                }
                              }}
                              className="font-bold text-sm lg:text-md text-[#C39533] w-14 lg:w-16 text-center px-1.5 lg:px-2 border-x-2 border-[#C39533] focus:outline-none focus:ring-2 focus:ring-[#C39533]/50"
                              aria-label="Quantity"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentQty = parseInt(product.quantity) || 1;
                                updateCartItemQuantity(product.cartId, currentQty + 1);
                              }}
                              className="p-1.5 lg:p-2 hover:bg-[#C39533]/20 active:bg-[#C39533]/30 transition rounded-r-md lg:rounded-r-lg"
                              aria-label="Increase quantity"
                            >
                              <AiOutlinePlus className="size-4 lg:size-5 text-[#C39533]" />
                            </button>
                          </div>
                          <p className="text-sm lg:text-md text-[#4A5565] whitespace-nowrap">
                            {getSizeType(product.sizeType, product.quantity)}
                          </p>
                        </div>
                        {product.requestedArea && (
                          <p className="text-sm lg:text-md text-[#4A5565]">
                            For: <span className="font-bold text-[#C39533]">{product.requestedArea}</span> sq ft
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mt-auto flex items-center justify-end">
                        <p className="font-bold tracking-tight text-md lg:text-lg text-[#498118]">
                          RM {parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
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