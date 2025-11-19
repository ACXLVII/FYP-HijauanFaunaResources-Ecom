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
import {
  FaCloudSunRain,
  FaHandSparkles,
  FaRegGrinStars,
  FaRegThumbsUp
} from 'react-icons/fa';
import {
  GiBandageRoll,
  GiBarefoot,
  GiGardeningShears,
  GiGolfFlag,
  GiGolfTee,
  GiGrass,
  GiHighGrass,
  GiReceiveMoney
} from "react-icons/gi";
import {
  GrUpgrade
} from "react-icons/gr";
import {
  MdGrass,
  MdOutlineTexture
} from "react-icons/md";
import {
  TbRuler
} from "react-icons/tb";
import {
  WiStars,
} from "react-icons/wi";

// Icon Map
const IconMap = {
  // Measurement Icons
  TbRuler,
  GiBandageRoll,
  // Close Icon
  AiOutlineClose,
  // Artificial Grass Icons
  // 15mm
  GiGolfTee,
  GiGolfFlag,
  GrUpgrade,
  // 25mm
  GiReceiveMoney,
  FaCloudSunRain,
  GiGardeningShears,
  // 30mm
  FaRegThumbsUp,
  MdOutlineTexture,
  FaHandSparkles,
  // 35mm
  GiHighGrass,
  GiBarefoot,
  GiGrass,
  // 40mm
  WiStars,
  FaRegGrinStars,
  MdGrass,
};

// Icon Renderer
function renderIcon(icon, className = "size-10 lg:size-12 text-[#C39533]") {
  if (!icon) return null;
  if (typeof icon === 'string' && IconMap[icon]) {
    const IconComponent = IconMap[icon];
    return <IconComponent className={className} />;
  }
  if (typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent className={className} />;
  }
  return null;
}

function parseAreaFromMeasurement(measurement) {
  // Example: '83ft x 6.5ft' or '2ft x 1ft' or '1ft x 1ft'
  const match = measurement.match(/([\d.]+)\s*ft\s*x\s*([\d.]+)\s*ft/i);
  if (match) {
    return parseFloat(match[1]) * parseFloat(match[2]);
  }
  // fallback: try just a number
  const num = parseFloat(measurement);
  return isNaN(num) ? 1 : num;
}

export default function PricingCalculator({
  category, id, name, images, priceGroup
}) {
  // All hooks must be called before any conditional returns
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userArea, setUserArea] = useState('');
  const [userPieces, setUserPieces] = useState('');
  const [touched, setTouched] = useState(false);
  const [touchedPieces, setTouchedPieces] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const { addToCart } = useCart();

  // Early return if priceGroup is missing or invalid (after hooks)
  if (!priceGroup || !Array.isArray(priceGroup) || priceGroup.length === 0) {
    return (
      <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
        <p className="text-center text-[#4A5565]">Loading pricing information...</p>
      </div>
    );
  }

  // Prepare priceGroups with area and price as number
  const groupsWithArea = priceGroup.map(group => ({
    ...group,
    area: group.area || parseAreaFromMeasurement(group.measurement),
    price: typeof group.price === 'number' ? group.price : parseFloat(group.price.replace(/[^\d.]/g, '')),
  }));

  // If multiple price groups, allow selection
  // Ensure selectedIdx is within bounds
  const safeSelectedIdx = Math.min(selectedIdx, groupsWithArea.length - 1);
  const selectedGroup = groupsWithArea[safeSelectedIdx];

  // Additional safety check
  if (!selectedGroup) {
    return (
      <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
        <p className="text-center text-[#4A5565]">Loading pricing information...</p>
      </div>
    );
  }

  const handleMeasurementChange = (idx) => {
    if (idx !== selectedIdx) { // Only reset if switching to a different measurement
      setUserArea('');
      setUserPieces('');
      setTouched(false);
      setTouchedPieces(false);
      setShowErrors(false);
    }
    setSelectedIdx(idx);
  };

  const handleAreaChange = (e) => {
    let val = e.target.value.replace(/[^\d.]/g, ''); // Allow digits and decimal points
    const parts = val.split('.');
    if (parts.length > 2) { // Prevent multiple decimal points
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    val = val.replace(/^0+/, '') || '0'; // Remove leading zeros but keep single zero before decimal
    setUserArea(val);

    // Auto-update pieces if area is valid and pieces field is not focused
    if (val && focusedField !== 'pieces') {
      const areaVal = parseFloat(val);
      if (!isNaN(areaVal) && areaVal > 0) {
        if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
          setUserPieces(areaVal.toString());
        } else {
          const calculatedPieces = Math.ceil(areaVal / selectedGroup.area);
          setUserPieces(calculatedPieces.toString());
        }
      } else if (areaVal === 0 || isNaN(areaVal)) {
        // Clear pieces if area is invalid or zero
        setUserPieces('');
      }
    }
  };

  const handlePiecesChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, ''); // Only integers for pieces
    val = val.replace(/^0+/, '') || '0';
    setUserPieces(val);
    
    // Auto-update area if pieces is valid and area field is not focused
    if (val && focusedField !== 'area') {
      const piecesVal = parseInt(val, 10);
      if (!isNaN(piecesVal) && piecesVal > 0) {
        if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
          setUserArea(piecesVal.toString());
        } else {
          const calculatedArea = piecesVal * selectedGroup.area;
          setUserArea(calculatedArea.toFixed(2));
        }
      } else if (piecesVal === 0 || isNaN(piecesVal)) {
        // Clear area if pieces is invalid or zero
        setUserArea('');
      }
    }
  };

  const handlePiecesIncrement = () => {
    const current = parseInt(userPieces || '0', 10);
    const newVal = (current + 1).toString();
    setUserPieces(newVal);
    setTouchedPieces(true);
    
    // Auto-update area
    if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
      setUserArea(newVal);
    } else {
      const calculatedArea = (current + 1) * selectedGroup.area;
      setUserArea(calculatedArea.toFixed(2));
    }
  };

  const handlePiecesDecrement = () => {
    const current = parseInt(userPieces || '0', 10);
    if (current > 0) {
      const newVal = (current - 1).toString();
      setUserPieces(newVal);
      setTouchedPieces(true);
      
      // Auto-update area
      if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
        setUserArea(newVal);
      } else {
        const calculatedArea = (current - 1) * selectedGroup.area;
        setUserArea(calculatedArea.toFixed(2));
      }
    } else if (current === 0) {
      // Clear area if pieces becomes 0
      setUserArea('');
      setUserPieces('');
    }
  };

  const area = parseFloat(userArea); // Use parseFloat instead of parseInt
  const validArea = !isNaN(area) && area > 0;
  
  const pieces = parseInt(userPieces || '0', 10);
  const validPieces = !isNaN(pieces) && pieces > 0;
  
  // Error handling
  const shouldShowAreaError = focusedField !== 'area' && (showErrors || (touched && userArea.trim().length > 0)) && (!userArea || !validArea);
  const areaError = shouldShowAreaError ? 'Please enter a valid number bigger than 0.' : '';
  
  const shouldShowPiecesError = focusedField !== 'pieces' && (showErrors || (touchedPieces && userPieces.trim().length > 0)) && (!userPieces || !validPieces);
  const piecesError = shouldShowPiecesError ? 'Please enter a valid number bigger than 0.' : '';

  // Calculation for selected unit
  let quantity = 0;
  let totalAreaCovered = 0;
  let extraArea = 0;
  let totalPrice = 0;
  let calculatedArea = 0;

  if (validPieces) {
    // Use pieces if valid
    quantity = pieces;
    if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
      totalAreaCovered = pieces;
      calculatedArea = pieces;
      extraArea = 0;
    } else {
      totalAreaCovered = pieces * selectedGroup.area;
      calculatedArea = totalAreaCovered;
      extraArea = validArea ? totalAreaCovered - area : 0;
    }
    totalPrice = quantity * selectedGroup.price;
  } else if (validArea) {
    // Fall back to area calculation if pieces not set
    if (selectedGroup.sizeType === 'sqft' || selectedGroup.sizeType === 'square foot') {
      quantity = area;
      totalAreaCovered = area;
      extraArea = 0;
      totalPrice = quantity * selectedGroup.price;
    } else {
      quantity = Math.ceil(area / selectedGroup.area);
      totalAreaCovered = quantity * selectedGroup.area;
      extraArea = totalAreaCovered - area;
      totalPrice = quantity * selectedGroup.price;
    }
  }

  const handleAddToCart = () => {
    // Require either area or pieces to be valid
    if ((!userArea || !validArea) && (!userPieces || !validPieces)) {
      setTouched(true);
      setTouchedPieces(true);
      setShowErrors(true);
      return;
    }

    const finalArea = validPieces ? calculatedArea : area;

    addToCart({
      category,
      id,
      name,
      image: images[0],
      quantity,
      price: (selectedGroup.price * quantity).toFixed(2),
      priceID: selectedGroup.priceID,
      measurement: selectedGroup.measurement,
      sizeType: selectedGroup.sizeType,
      requestedArea: finalArea,
    });
    toast.success(`Added to cart! Total: RM ${totalPrice.toFixed(2)}`);
  };

  const hasValidInput = validArea || validPieces;

  return (
    <div className="space-y-4 lg:space-y-8 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
      <Toaster position="top-center" />

      {/* Unit selector if multiple price groups */}
      <div className="">

        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          Available measurements:
        </div>

        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          {groupsWithArea.map((group, idx) => (
            <button
              key={group.sizeType + group.measurement}
              className={`
                flex flex-col p-2 lg:p-4
                ${selectedIdx === idx ? 'text-[#4A5565] shadow-lg border-2 border-[#C39533]' : 'text-[#AAAAAA] border-2 border-[#AAAAAA] cursor-pointer'}
                rounded-md lg:rounded-lg
              `}
              onClick={() => handleMeasurementChange(idx)}
              type="button"
            >
              <div className="flex flex-col items-center justify-center">
                {renderIcon(group.icon, `size-10 lg:size-12 ${selectedIdx === idx ? 'text-[#C39533]' : 'text-[#AAAAAA]'}`)}
                <p
                  className={`
                    font-bold tracking-tight text-center text-xl lg:text-2xl
                    ${selectedIdx === idx ? 'text-[#498118]' : 'text-[#AAAAAA]'}
                  `}
                >
                  RM {group.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-sm lg:text-md">
                  per {group.sizeType}
                </p>
                <p className="text-center text-sm lg:text-md">
                  ({group.measurement})
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Area Input */}
      <div className="">

        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          What's your area?
        </div>

        <div className="relative flex flex-col">
          <label className="relative flex-1">
          <input
            id="userInputSqft"
            name="userInputSqft"
            type="number"
            min={0.1}
            step={0.1} // Allow decimal steps
            className={`h-12 w-full bg-[#FFFFFF] text-center text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
              touched && validArea 
                ? 'border-[#C39533]' 
                : shouldShowAreaError
                  ? 'border-red-500' 
                  : 'border-[#AAAAAA] focus:border-[#C39533]'
            }`}
            value={userArea}
            onChange={handleAreaChange}
            onFocus={() => setFocusedField('area')}
            onBlur={() => {
              setTouched(true);
              setFocusedField(null);
            }}
            placeholder="area (square feet)"
            inputMode="decimal" // Change to decimal for better mobile experience
            aria-label="Total area needed, in square feet (sq ft)."
            onWheel={e => e.target.blur()}
          />
          {userArea && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUserArea('');
                setUserPieces('');
                setTouched(false);
                setTouchedPieces(false);
                setShowErrors(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#AAAAAA] hover:text-[#4A5565] transition-colors cursor-pointer"
              aria-label="Clear input"
            >
              <AiOutlineClose className="size-6" />
            </button>
          )}
          </label>
        </div>

        {areaError && (
          <div role="alert" className="mt-1 lg:mt-2 text-justify text-sm lg:text-md text-red-500">
            {areaError}
          </div>
        )}

      </div>

      <div className="flex items-center justify-center">
        <hr className="w-full mr-4 lg:mr-8 border-t-2 border-[#C39533]" />
        <p className="font-bold tracking-tight text-center text-md lg:text-lg text-[#101828]">OR</p>
        <hr className="w-full ml-4 lg:ml-8 border-t-2 border-[#C39533]" />
      </div>

      {/* Pieces Input */}
      <div className="">
        <div className="mb-2 lg:mb-4 font-semibold text-md lg:text-lg text-[#101828]">
          How many pieces do you want?
        </div>

        <div className="relative flex items-center gap-2 lg:gap-4">
          <button
            type="button"
            onClick={handlePiecesDecrement}
            disabled={!userPieces || pieces <= 0}
            className={`
              flex items-center justify-center h-12 w-12 rounded-md lg:rounded-lg border-2 transition-colors
              ${!userPieces || pieces <= 0
                ? 'border-[#AAAAAA] bg-[#F5F5F5] text-[#AAAAAA] cursor-not-allowed'
                : 'border-[#C39533] bg-[#FFFFFF] text-[#C39533] hover:bg-[#C39533] hover:text-[#FFFFFF] cursor-pointer'
              }
            `}
            aria-label="Reduce pieces"
          >
            <AiOutlineMinus className="size-5 lg:size-6" />
          </button>

          <label className="relative flex-1">
            <input
              id="userInputPieces"
              name="userInputPieces"
              type="number"
              min={0}
              step={1}
              className={`h-12 w-full bg-[#FFFFFF] text-center text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                touchedPieces && validPieces 
                  ? 'border-[#C39533]' 
                  : shouldShowPiecesError 
                    ? 'border-red-500' 
                    : 'border-[#AAAAAA] focus:border-[#C39533]'
              }`}
              value={userPieces}
              onChange={handlePiecesChange}
              onFocus={() => setFocusedField('pieces')}
              onBlur={() => {
                setTouchedPieces(true);
                setFocusedField(null);
              }}
              placeholder="0"
              inputMode="numeric"
              aria-label="Number of pieces"
              onWheel={e => e.target.blur()}
            />
            {userPieces && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUserPieces('');
                  setUserArea('');
                  setTouchedPieces(false);
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
            onClick={handlePiecesIncrement}
            className="flex items-center justify-center h-12 w-12 rounded-md lg:rounded-lg border-2 border-[#C39533] bg-[#FFFFFF] text-[#C39533] hover:bg-[#C39533] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            aria-label="Add pieces"
          >
            <AiOutlinePlus className="size-5 lg:size-6" />
          </button>
        </div>

        {piecesError && (
          <div role="alert" className="mt-1 lg:mt-2 text-justify text-sm lg:text-md text-red-500">
            {piecesError}
          </div>
        )}
      </div>

      {/* Breakdown for selected unit */}
      {hasValidInput && (
        <>
          <hr className="border-t-2 border-[#C39533]" />

          <div className="">
            <div className="font-semibold text-md lg:text-lg text-[#101828]">
              Your requirements are:
            </div>
            <ul className="ml-6 lg:ml-8 text-justify text-md lg:text-lg text-[#4A5565] list-disc">
              <li>
                <span className="font-bold text-[#C39533]">{quantity}</span> {selectedGroup.sizeType}(s).
              </li>
              {selectedGroup.sizeType !== 'sqft' && selectedGroup.sizeType !== 'square foot' && extraArea > 0 && validArea && (
                <li>
                  <span className="font-bold text-[#C39533]">{extraArea.toFixed(2)}</span> sqft extra will be included, since the minimum measurement of a {selectedGroup.sizeType} is {selectedGroup.area} sqft ({selectedGroup.measurement}).
                </li>
              )}
            </ul>
          </div>

          <div className="">
            <div className="font-semibold text-md lg:text-lg text-[#101828]">
              Purchase includes:
            </div>
            <ul className="ml-6 lg:ml-8 text-justify text-md lg:text-lg text-[#4A5565] list-disc">
              <li>
                10 Year Warranty
              </li>
              <li>
                Complimentary mini garden.
              </li>
            </ul>
          </div>

          <div className="font-semibold text-md lg:text-lg text-[#101828]">
            Total: <span className="tracking-tight text-[#498118]">RM {totalPrice.toFixed(2)}</span>
          </div>
        </>
      )}

      {/* Add to Cart */}
      <button
        className={`w-full p-4 font-bold text-md lg:text-lg text-[#FFFFFF] rounded-md lg:rounded-lg shadow-lg transition ${
          !hasValidInput
            ? 'bg-[#498118]/50 cursor-not-allowed' 
            : 'bg-[#498118] cursor-pointer hover:scale-105 active:scale-95'
        }`}
        onClick={handleAddToCart}
        type="button"
        aria-disabled={!hasValidInput}
      >
        Add to Cart
      </button>

    </div>
  );
}

PricingCalculator.propTypes = {
  priceGroup: PropTypes.arrayOf(PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    measurement: PropTypes.string.isRequired,
    sizeType: PropTypes.string.isRequired,
    icon: PropTypes.any,
    area: PropTypes.number, // optional, will be computed if not present
  })).isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};