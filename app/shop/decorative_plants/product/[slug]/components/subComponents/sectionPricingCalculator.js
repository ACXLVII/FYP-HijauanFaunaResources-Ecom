'use client'

import React, { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useCart } from '@/app/hooks/useCart';

// Icon Imports
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineMinus
} from 'react-icons/ai';

export default function PricingCalculator({
  category, id, name, images, priceGroup, inStock
}) {
  const [quantity, setQuantity] = useState('1');
  const [touched, setTouched] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const { addToCart } = useCart();

  // Early return if priceGroup is missing or invalid
  if (!priceGroup || !Array.isArray(priceGroup) || priceGroup.length === 0 || !priceGroup[0]) {
    return (
      <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
        <p className="text-center text-[#4A5565]">Loading pricing information...</p>
      </div>
    );
  }

  // Prepare priceGroups with price as number (matching live_grass pattern)
  const groupsWithPrice = priceGroup.map(group => ({
    ...group,
    price: typeof group.price === 'number' ? group.price : parseFloat(group.price.replace(/[^\d.]/g, '')),
  }));

  // Use first price group (decorative_plants only has one price group)
  const selectedGroup = groupsWithPrice[0];

  // Additional validation for parsed price
  if (!selectedGroup || isNaN(selectedGroup.price)) {
    return (
      <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
        <p className="text-center text-[#4A5565]">Invalid price information.</p>
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, ''); // Only integers
    val = val.replace(/^0+/, '') || '0';
    setQuantity(val);
  };

  const handleQuantityIncrement = () => {
    const current = parseInt(quantity || '0', 10);
    const newVal = (current + 1).toString();
    setQuantity(newVal);
    setTouched(true);
  };

  const handleQuantityDecrement = () => {
    const current = parseInt(quantity || '0', 10);
    if (current > 1) {
      const newVal = (current - 1).toString();
      setQuantity(newVal);
      setTouched(true);
    } else if (current === 1) {
      // Keep minimum at 1
      setQuantity('1');
      setTouched(true);
    }
  };

  const qty = parseInt(quantity || '0', 10);
  const validQuantity = !isNaN(qty) && qty > 0;

  // Error handling
  const shouldShowQuantityError = focusedField !== 'quantity' && (showErrors || (touched && quantity.trim().length > 0)) && (!quantity || !validQuantity);
  const quantityError = shouldShowQuantityError ? 'Please enter a valid number bigger than 0.' : '';

  const totalPrice = validQuantity ? qty * selectedGroup.price : 0;

  const handleAddToCart = () => {
    // Check if out of stock
    if (!inStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    // Validate quantity
    if (!quantity || !validQuantity) {
      setTouched(true);
      setShowErrors(true);
      return;
    }

    // Helper function to convert base64 string to data URI (matching live_grass pattern)
    const getImageSrc = (imageData) => {
      if (!imageData) return '/images/shop/plants.jpg';
      
      // Handle if imageData is an object with src property
      const imageString = typeof imageData === 'object' && imageData.src ? imageData.src : imageData;
      
      // If it's not a string, return fallback
      if (typeof imageString !== 'string') {
        return '/images/shop/plants.jpg';
      }
      
      // If it's already a data URI or URL, return as is
      if (imageString.startsWith('data:') || imageString.startsWith('http') || imageString.startsWith('/')) {
        return imageString;
      }
      
      // If it's a base64 string without prefix, add the data URI prefix
      const imageType = 'jpeg';
      return `data:image/${imageType};base64,${imageString}`;
    };
    
    // Extract image string from object if needed, or generate fallback
    const imageString = images && images[0] ? getImageSrc(images[0]) : '/images/shop/plants.jpg';

    addToCart({
      category,
      id,
      name,
      image: imageString,
      quantity: qty,
      price: (selectedGroup.price * qty).toFixed(2),
      priceID_TEST: selectedGroup.priceID_TEST,
      measurement: 'unit',
      sizeType: 'unit',
    });

    toast.success(`Added to cart! Total: RM ${totalPrice.toFixed(2)}`);
  };

  const hasValidInput = validQuantity && inStock;

  return (
    <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
      <Toaster position="top-center" />

      {/* Stock Status */}
      <div className="">
        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          Availability:
        </div>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg text-md lg:text-lg font-semibold ${
          inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </div>
      </div>

      {/* Price Display */}
      <div className="">
        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          Price:
        </div>

        <div className="flex flex-col items-center justify-center p-4 lg:p-6 rounded-lg lg:rounded-xl border-2 border-[#C39533]">
          <p className="font-bold tracking-tight text-center text-3xl lg:text-4xl text-[#498118]">
            RM {selectedGroup.price.toFixed(2)}
          </p>
          <p className="text-center text-sm lg:text-md text-[#4A5565]">
            per unit
          </p>
        </div>
      </div>

      {/* Quantity Counter */}
      <div className="">
        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          Quantity:
        </div>

        <div className="relative flex items-center gap-2 lg:gap-4">
          <button
            type="button"
            onClick={handleQuantityDecrement}
            disabled={!quantity || qty <= 1}
            className={`
              flex items-center justify-center h-12 w-12 rounded-md lg:rounded-lg border-2 transition-colors
              ${!quantity || qty <= 1
                ? 'border-[#AAAAAA] bg-[#F5F5F5] text-[#AAAAAA] cursor-not-allowed'
                : 'border-[#C39533] bg-[#FFFFFF] text-[#C39533] hover:bg-[#C39533] hover:text-[#FFFFFF] cursor-pointer'
              }
            `}
            aria-label="Reduce quantity"
          >
            <AiOutlineMinus className="size-5 lg:size-6" />
          </button>

          <label className="relative flex-1">
            <input
              id="userInputQuantity"
              name="userInputQuantity"
              type="number"
              min={1}
              step={1}
              className={`h-12 w-full bg-[#FFFFFF] text-center text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                touched && validQuantity 
                  ? 'border-[#C39533]' 
                  : shouldShowQuantityError 
                    ? 'border-red-500' 
                    : 'border-[#AAAAAA] focus:border-[#C39533]'
              }`}
              value={quantity}
              onChange={handleQuantityChange}
              onFocus={() => setFocusedField('quantity')}
              onBlur={() => {
                setTouched(true);
                setFocusedField(null);
              }}
              placeholder="1"
              inputMode="numeric"
              aria-label="Quantity"
              onWheel={e => e.target.blur()}
            />
            {quantity && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity('1');
                  setTouched(false);
                  setShowErrors(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#AAAAAA] hover:text-[#4A5565] transition-colors cursor-pointer"
                aria-label="Clear input"
              >
                <AiOutlineClose className="size-6" />
              </button>
            )}
          </label>

          <button
            type="button"
            onClick={handleQuantityIncrement}
            className="flex items-center justify-center h-12 w-12 rounded-md lg:rounded-lg border-2 border-[#C39533] bg-[#FFFFFF] text-[#C39533] hover:bg-[#C39533] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            aria-label="Add quantity"
          >
            <AiOutlinePlus className="size-5 lg:size-6" />
          </button>
        </div>

        {quantityError && (
          <div role="alert" className="mt-1 lg:mt-2 text-justify text-sm lg:text-md text-red-500">
            {quantityError}
          </div>
        )}
      </div>

      {/* Total Price Display */}
      {hasValidInput && (
        <div className="font-semibold text-md lg:text-lg text-[#101828]">
          Total: <span className="tracking-tight text-[#498118]">RM {totalPrice.toFixed(2)}</span>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        className={`w-full p-4 font-bold text-md lg:text-lg text-[#FFFFFF] rounded-md lg:rounded-lg shadow-lg transition ${
          !hasValidInput
            ? 'bg-[#498118]/50 cursor-not-allowed' 
            : 'bg-[#498118] cursor-pointer hover:scale-105 active:scale-95'
        }`}
        onClick={handleAddToCart}
        type="button"
        aria-disabled={!hasValidInput}
        disabled={!hasValidInput}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>

    </div>
  );
}

PricingCalculator.propTypes = {
  priceGroup: PropTypes.arrayOf(PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    priceID_TEST: PropTypes.string,
  })).isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  inStock: PropTypes.bool.isRequired,
};

