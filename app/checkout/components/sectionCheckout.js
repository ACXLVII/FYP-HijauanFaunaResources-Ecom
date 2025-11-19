'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import toast, { Toaster } from 'react-hot-toast';

// STRIPE
import getStripe from "../../stripe";

// Cart Hook
import { useCart } from '@/app/hooks/useCart';

// Icon Imports
import { FaStore, FaTruck } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";

// Store location coordinates (update with your actual store location)
const STORE_LOCATION = {
  lat: 3.2122, // Example: Kuala Lumpur coordinates
  lng: 101.5741,
  address: "31, Jalan 1/3 Bukit Saujana, 47000 Sungai Buloh, Selangor" // Update with actual address
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Calculate shipping cost based on distance
const calculateShippingCost = (distance) => {
  // Base shipping cost
  const baseCost = 5; // RM 5 base cost
  // Cost per kilometer
  const costPerKm = 5; // RM 5 per km
  // Minimum shipping cost
  const minCost = 20; // RM 20 minimum
  
  const calculatedCost = baseCost + (distance * costPerKm);
  return Math.max(calculatedCost, minCost);
};

export default function SectionCheckout() {
  const { cart } = useCart();
  const productsInCart = cart;
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    requestShipping: false,
    addressDetails: {
      address: "",
      postcode: "",
      city: "",
      state: "",
    },
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    postcode: false,
    city: false,
    state: false,
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [customerCoordinates, setCustomerCoordinates] = useState(null);
  const [distance, setDistance] = useState(0);
  const [addressError, setAddressError] = useState('');

  const subtotal = productsInCart.reduce((sum, product) => {
    const price = parseFloat(String(product.price).replace(/[^0-9.-]+/g, ""));
    return sum + price;
  }, 0);
  
  const total = subtotal + (orderData.requestShipping ? shippingCost : 0);
  
  const selectedProductFields = productsInCart.map(product => ({
    category: product.category,
    id: product.id,
    quantity: product.quantity,
    sizeType: product.sizeType,
    price: product.price,
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('addressDetails.')) {
      const fieldName = name.split('.')[1];
      setOrderData((prev) => ({
        ...prev,
        addressDetails: {
          ...prev.addressDetails,
          [fieldName]: value,
        },
      }));
      
      // Mark address field as touched
      if (value.trim().length > 0) {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
      }
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      
      // Mark field as touched when it has any value (including autofill)
      if ((name === 'name' || name === 'email' || name === 'phone') && value.trim().length > 0) {
        setTouched(prev => ({ ...prev, [name]: true }));
      }
    }
  };

  // Geocode address to get coordinates
  const geocodeAddress = async (addressDetails) => {
    try {
      const { address, postcode, city, state } = addressDetails;
      if (!address || !postcode || !city || !state) {
        return null;
      }

      const fullAddress = `${address}, ${postcode} ${city}, ${state}, Malaysia`;
      
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
        {
          headers: {
            'User-Agent': 'HijauanFaunaResources-Ecom' // Required by Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Calculate shipping when address details change
  useEffect(() => {
    const calculateShipping = async () => {
      if (!orderData.requestShipping) {
        setShippingCost(0);
        setCustomerCoordinates(null);
        setDistance(0);
        setAddressError('');
        return;
      }

      const { address, postcode, city, state } = orderData.addressDetails;
      
      // Check if all address fields are filled
      if (!address || !postcode || !city || !state) {
        setShippingCost(0);
        setCustomerCoordinates(null);
        setDistance(0);
        setAddressError('');
        return;
      }

      setIsCalculatingShipping(true);
      setAddressError('');
      
      try {
        const coords = await geocodeAddress(orderData.addressDetails);
        
        if (coords) {
          setCustomerCoordinates(coords);
          const calculatedDistance = calculateDistance(
            STORE_LOCATION.lat,
            STORE_LOCATION.lng,
            coords.lat,
            coords.lng
          );
          setDistance(calculatedDistance);
          const cost = calculateShippingCost(calculatedDistance);
          setShippingCost(cost);
          setAddressError('');
        } else {
          setAddressError("Could not find address. Please check your address details.");
          setShippingCost(0);
          setCustomerCoordinates(null);
          setDistance(0);
        }
      } catch (error) {
        console.error('Shipping calculation error:', error);
        setAddressError("Error calculating shipping. Please check your address and try again.");
        setShippingCost(0);
        setCustomerCoordinates(null);
        setDistance(0);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(() => {
      calculateShipping();
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [orderData.requestShipping, orderData.addressDetails]);

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      // if (!orderData.email || !orderData.name || !orderData.phone) {
      //   toast.error("Please fill in all required fields");
      //   setLoading(false);
      //   return;
      // }

      // Prepare line items for Stripe
      const lineItems = productsInCart.map(product => ({
        price: product.priceID,
        quantity: product.quantity,
      }));

      // const lineItems = [
      //   // LIVE GRASS
      //   // Japanese
      //   {
      //     price: 'price_1RwGPHFg23GXTtGmzR5eOtLN',
      //     quantity: 400,
      //   },
      //   // Philippine
      //   {
      //     price: 'price_1RwGOWFg23GXTtGmxArMvtYC',
      //     quantity: 400,
      //   },
      //   // Pearl
      //   {
      //     price: 'price_1RwGQ2Fg23GXTtGmP7bPQAbU',
      //     quantity: 400,
      //   },
      //   // Cow
      //   {
      //     price: 'price_1RwGQeFg23GXTtGmlRrgkvKx',
      //     quantity: 400,
      //   },
      //   // ARTIFICIAL GRASS
      //   // 15mm Golf
      //   {
      //     price: 'price_1RyV5cFg23GXTtGmThoFJTuD',
      //     quantity: 400,
      //   },
      //   //25mm Sqft
      //   {
      //     price: 'price_1RwGTRFg23GXTtGmE5gL2uPF',
      //     quantity: 400,
      //   },
      //   // 25mm Roll
      //   {
      //     price: 'price_1RwGTmFg23GXTtGmjCDNpHzc',
      //     quantity: 400,
      //   },
      //   // 30mm Sqft
      //   {
      //     price: 'price_1RwGUKFg23GXTtGmbk9O3xwz',
      //     quantity: 400,
      //   },
      //   // 30mm Roll
      //   {
      //     price: 'price_1RwGUrFg23GXTtGmIWhe6qam',
      //     quantity: 400,
      //   },
      //   // 35mm Sqft
      //   {
      //     price: 'price_1RwGYtFg23GXTtGm5SUHrPV4',
      //     quantity: 400,
      //   },
      //   // 35mm Roll
      //   {
      //     price: 'price_1RwGZCFg23GXTtGmB1R1PgIx',
      //     quantity: 400,
      //   },
      //   // 40mm Sqft
      //   {
      //     price: 'price_1RwGZkFg23GXTtGmfLoFF4EP',
      //     quantity: 400,
      //   },
      //   // 40mm Roll
      //   {
      //     price: 'price_1RwGa5Fg23GXTtGmDuzk9d6e',
      //     quantity: 400,
      //   }
      // ]

      // Create checkout session
      console.log("Line Items:", lineItems);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: lineItems,
          customerEmail: orderData.email,
          requestShipping: orderData.requestShipping,
          shippingCost: orderData.requestShipping ? shippingCost : 0,
          metadata: {
            customerName: orderData.name,
            customerEmail: orderData.email,
            customerPhone: orderData.phone,
            requestShipping: orderData.requestShipping,
            addressDetails: orderData.requestShipping ? JSON.stringify(orderData.addressDetails) : '',
            distance: orderData.requestShipping ? distance.toString() : '0',
            shippingCost: orderData.requestShipping ? shippingCost.toString() : '0',
            products: JSON.stringify(selectedProductFields),
            total: total.toString(),
          },
        }),
      });
      console.log("Metadata: ", orderData.metadata);

      const { sessionId, error } = await response.json();

      if (error) {
        toast.error("Error creating checkout session");
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        toast.error("Error redirecting to checkout");
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error("An error occurred during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation Logic
  const isNameValid = orderData.name.trim().length > 0;
  const isEmailValid = /\S+@\S+\.\S+/.test(orderData.email);
  const isPhoneValid = orderData.phone.trim().length > 9 && !/[a-zA-Z]/.test(orderData.phone);
  
  // Address validation
  const { address, postcode, city, state } = orderData.addressDetails;
  const isAddressValid = !orderData.requestShipping || (
    address.trim().length > 0 &&
    postcode.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    customerCoordinates !== null &&
    addressError === ''
  );
  
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isAddressValid;
  
  // Helper functions for consistent error display (hide errors for focused field)
  const shouldShowNameError = focusedField !== 'name' && (showErrors || (touched.name && orderData.name.trim().length > 0)) && !isNameValid;
  const shouldShowEmailError = focusedField !== 'email' && (showErrors || (touched.email && orderData.email.trim().length > 0)) && !isEmailValid;
  const shouldShowPhoneError = focusedField !== 'phone' && (showErrors || (touched.phone && orderData.phone.trim().length > 0)) && !isPhoneValid;
  
  // Error Messages
  const nameError = shouldShowNameError ? 'Please enter your name.' : '';
  const emailError = shouldShowEmailError ? 'Please enter a valid email address.' : '';
  const phoneError = shouldShowPhoneError ? 'Please enter a valid phone number.' : '';
  
  // Handle Disabled Button Click
  const handleDisabledButtonClick = () => {
    // Mark all fields as touched AND enable error display
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      postcode: true,
      city: true,
      state: true,
    });
    setShowErrors(true);
  };

  return (
    <div className="bg-[#000000]/50">
      <Toaster position="top-center" />
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-stretch">

          {/* Checkout Form */}
          <div className="mb-4 lg:mb-0 p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg h-full">
            <h2 className="mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
              Customer Information
            </h2>
            <hr className="mb-4 border-t-2 border-[#C39533]" />

            <form className="space-y-2 lg:space-y-4">

              {/* Name */}
              <div className="">
                <div className="flex items-center justify-between mb-1 lg:mb-2">
                  <h3 className="text-md lg:text-lg text-[#4A5565]">
                    Name: <span className="text-red-500">*</span>
                  </h3>
                  { nameError && (
                    <div role="alert" className="text-sm lg:text-md text-red-500">{nameError}</div>
                  )}
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={orderData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => {
                    setTouched(t => ({ ...t, name: true }));
                    setFocusedField(null);
                  }}
                  className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                    touched.name && isNameValid 
                      ? 'border-[#C39533]' 
                      : shouldShowNameError 
                        ? 'border-red-500' 
                        : 'border-[#AAAAAA] focus:border-[#C39533]'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="">
                <div className="flex items-center justify-between mb-1 lg:mb-2">
                  <h3 className="text-md lg:text-lg text-[#4A5565]">
                    Email address: <span className="text-red-500">*</span>
                  </h3>
                  { emailError && (
                    <div role="alert" className="text-sm lg:text-md text-red-500">{emailError}</div>
                  )}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={orderData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => {
                    setTouched(t => ({ ...t, email: true }));
                    setFocusedField(null);
                  }}
                  className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                    touched.email && isEmailValid 
                      ? 'border-[#C39533]' 
                      : shouldShowEmailError 
                        ? 'border-red-500' 
                        : 'border-[#AAAAAA] focus:border-[#C39533]'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone Number */}
              <div className="">
                <div className="flex items-center justify-between mb-1 lg:mb-2">
                  <h3 className="text-md lg:text-lg text-[#4A5565]">
                    Phone Number: <span className="text-red-500">*</span>
                  </h3>
                  { phoneError && (
                    <div role="alert" className="text-sm lg:text-md text-red-500">{phoneError}</div>
                  )}
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={orderData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => {
                    setTouched(t => ({ ...t, phone: true }));
                    setFocusedField(null);
                  }}
                  className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                    touched.phone && isPhoneValid 
                      ? 'border-[#C39533]' 
                      : shouldShowPhoneError 
                        ? 'border-red-500' 
                        : 'border-[#AAAAAA] focus:border-[#C39533]'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <p className="text-center text-sm lg:text-md text-[#4A5565]">
                <span className="text-red-500">*</span> Required fields
              </p>

              {/* Preference Checkboxes */}
              <div className="">
                <h3 className="mb-1 lg:mb-2 text-md lg:text-lg text-[#4A5565]">
                  Options:
                </h3>
                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  {/* Pickup Button */}
                  <button
                    className={`
                      flex flex-col p-2 lg:p-4
                      ${!orderData.requestShipping ? 'text-[#C39533] shadow-lg border-2 border-[#C39533]' : 'text-[#AAAAAA] border-2 border-[#AAAAAA] cursor-pointer'}
                      rounded-md lg:rounded-lg
                    `}
                    onClick={() => setOrderData(prev => ({ ...prev, requestShipping: false }))}
                    type="button"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaStore className="size-10 lg:size-12" />
                      <p className="font-bold tracking-tight text-center text-xl lg:text-2xl">
                        Store<br/>Pickup
                      </p>
                    </div>
                  </button>
                  {/* Request Shipping Button */}
                  <button
                    className={`
                      flex flex-col p-2 lg:p-4
                      ${orderData.requestShipping ? 'text-[#C39533] shadow-lg border-2 border-[#C39533]' : 'text-[#AAAAAA] border-2 border-[#AAAAAA] cursor-pointer'}
                      rounded-md lg:rounded-lg
                    `}
                    onClick={() => setOrderData(prev => ({ ...prev, requestShipping: true }))}
                    type="button"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaTruck className="size-10 lg:size-12" />
                      <p className="font-bold tracking-tight text-center text-xl lg:text-2xl">
                        Request<br/>Shipping
                      </p>
                    </div>
                  </button>
                </div>

                {/* Shipping Address Fields - appears when shipping is selected */}
                {orderData.requestShipping && (
                  <div className="mt-4 lg:mt-8 space-y-2 lg:space-y-4">
                    <h2 className="mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
                      Shipping Information
                    </h2>
                    <hr className="mb-4 border-t-2 border-[#C39533]" />
                    
                    {/* Shipping Cost Disclaimer */}
                    {/* <div className="mb-4 p-2 lg:p-4 bg-yellow-50 rounded-md lg:rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1 lg:mb-2">
                        <IoInformationCircleOutline className="size-6 text-yellow-800" />
                        <p className="font-bold text-md lg:text-lg text-yellow-800">
                          Shipping Cost Information
                        </p>
                      </div>
                      <div className="text-justify text-sm lg:text-md text-yellow-800 space-y-1">
                        <p>
                          Shipping fees are calculated based on distance from our store location.
                        </p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>Base cost: RM 5.00</li>
                          <li>Additional cost: RM 5.00 per kilometer</li>
                          <li>Minimum shipping cost: RM 20.00</li>
                        </ul>
                        <p className="mt-2">
                          The shipping cost will be automatically calculated once you enter your complete address.
                        </p>
                      </div>
                    </div> */}
                    
                    {/* Address Line 1 */}
                    <div>
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h3 className="text-md lg:text-lg text-[#4A5565]">
                          Address Line 1: <span className="text-red-500">*</span>
                        </h3>
                        {focusedField !== 'address' && showErrors && touched.address && !orderData.addressDetails.address.trim() && (
                          <div role="alert" className="text-sm lg:text-md text-red-500">Please enter your address.</div>
                        )}
                      </div>
                      <input
                        id="addressDetails.address"
                        name="addressDetails.address"
                        type="text"
                        autoComplete="street-address"
                        required
                        value={orderData.addressDetails.address}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => {
                          setTouched(t => ({ ...t, address: true }));
                          setFocusedField(null);
                        }}
                        className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                          touched.address && orderData.addressDetails.address.trim().length > 0 && !addressError
                            ? 'border-[#C39533]' 
                            : (showErrors && touched.address && !orderData.addressDetails.address.trim()) || addressError
                              ? 'border-red-500'
                              : 'border-[#AAAAAA] focus:border-[#C39533]'
                        }`}
                        placeholder="Enter your street address"
                      />
                    </div>

                    {/* Postcode */}
                    <div>
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h3 className="text-md lg:text-lg text-[#4A5565]">
                          Postcode: <span className="text-red-500">*</span>
                        </h3>
                        {focusedField !== 'postcode' && showErrors && touched.postcode && !orderData.addressDetails.postcode.trim() && (
                          <div role="alert" className="text-sm lg:text-md text-red-500">Please enter your postcode.</div>
                        )}
                      </div>
                      <input
                        id="addressDetails.postcode"
                        name="addressDetails.postcode"
                        type="text"
                        autoComplete="postal-code"
                        required
                        value={orderData.addressDetails.postcode}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('postcode')}
                        onBlur={() => {
                          setTouched(t => ({ ...t, postcode: true }));
                          setFocusedField(null);
                        }}
                        className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                          touched.postcode && orderData.addressDetails.postcode.trim().length > 0 && !addressError
                            ? 'border-[#C39533]' 
                            : (showErrors && touched.postcode && !orderData.addressDetails.postcode.trim()) || addressError
                              ? 'border-red-500'
                              : 'border-[#AAAAAA] focus:border-[#C39533]'
                        }`}
                        placeholder="Enter your postcode"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h3 className="text-md lg:text-lg text-[#4A5565]">
                          City: <span className="text-red-500">*</span>
                        </h3>
                        {focusedField !== 'city' && showErrors && touched.city && !orderData.addressDetails.city.trim() && (
                          <div role="alert" className="text-sm lg:text-md text-red-500">Please enter your city.</div>
                        )}
                      </div>
                      <input
                        id="addressDetails.city"
                        name="addressDetails.city"
                        type="text"
                        autoComplete="address-level2"
                        required
                        value={orderData.addressDetails.city}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('city')}
                        onBlur={() => {
                          setTouched(t => ({ ...t, city: true }));
                          setFocusedField(null);
                        }}
                        className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                          touched.city && orderData.addressDetails.city.trim().length > 0 && !addressError
                            ? 'border-[#C39533]' 
                            : (showErrors && touched.city && !orderData.addressDetails.city.trim()) || addressError
                              ? 'border-red-500'
                              : 'border-[#AAAAAA] focus:border-[#C39533]'
                        }`}
                        placeholder="Enter your city"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h3 className="text-md lg:text-lg text-[#4A5565]">
                          State: <span className="text-red-500">*</span>
                        </h3>
                        {focusedField !== 'state' && showErrors && touched.state && !orderData.addressDetails.state.trim() && (
                          <div role="alert" className="text-sm lg:text-md text-red-500">Please enter your state.</div>
                        )}
                      </div>
                      <input
                        id="addressDetails.state"
                        name="addressDetails.state"
                        type="text"
                        autoComplete="address-level1"
                        required
                        value={orderData.addressDetails.state}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('state')}
                        onBlur={() => {
                          setTouched(t => ({ ...t, state: true }));
                          setFocusedField(null);
                        }}
                        className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                          touched.state && orderData.addressDetails.state.trim().length > 0 && !addressError
                            ? 'border-[#C39533]' 
                            : (showErrors && touched.state && !orderData.addressDetails.state.trim()) || addressError
                              ? 'border-red-500'
                              : 'border-[#AAAAAA] focus:border-[#C39533]'
                        }`}
                        placeholder="Enter your state"
                      />
                    </div>

                    <p className="text-center text-sm lg:text-md text-[#4A5565]">
                      <span className="text-red-500">*</span> Required fields
                    </p>

                    {/* Address Error Display */}
                    {addressError && (
                      <div className="p-2 lg:p-4 bg-red-50 rounded-md lg:rounded-lg border border-red-200">
                        <p className="text-sm lg:text-md text-red-800 text-center">
                          {addressError}
                        </p>
                      </div>
                    )}
                    
                    {/* Shipping Cost Display */}
                    {isCalculatingShipping && !addressError && (
                      <div className="p-2 lg:p-4 bg-blue-50 rounded-md lg:rounded-lg border border-blue-200">
                        <p className="text-sm lg:text-md text-blue-800 text-center">
                          Calculating shipping cost...
                        </p>
                      </div>
                    )}
                    {!isCalculatingShipping && shippingCost > 0 && customerCoordinates && !addressError && (
                      <div className="p-2 lg:p-4 bg-green-50 rounded-md lg:rounded-lg border border-green-200">
                        <p className="text-sm lg:text-md text-green-800 text-center font-bold">
                          Shipping Cost: RM {shippingCost.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Order Summary */}
          <div className="p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg flex flex-col h-full">

            <h2 className="mb-2 lg:mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
              Order Summary
            </h2>

            <hr className="border-t-2 border-[#C39533]" />

            <ul className="divide-y divide-[#CCCCCC] flex-grow">
              {productsInCart.length === 0 ? (
                <li className="py-8 text-center text-[#4A5565]">Your cart is empty.</li>
              ) : (
                productsInCart.map((product, idx) => (
                  <li key={idx} className="flex items-center py-2 lg:py-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="size-16 mr-2 lg:mr-4 rounded-md object-cover border-2 border-[#C39533]"
                      width={64}
                      height={64}
                    />
                    <div className="flex-1">
                      <h2 className="font-bold tracking-tight text-md lg:text-lg text-[#101828]">
                        {product.name}
                      </h2>
                      <p className="text-md lg:text-lg text-[#4A5565]">
                        Quantity: <span className="font-bold text-[#C39533]">{product.quantity}</span> {product.sizeType}(s)
                      </p>
                    </div>
                    <p className="font-bold tracking-tight text-md lg:text-lg text-[#498118]">
                      RM {parseFloat(product.price).toFixed(2)}
                    </p>
                  </li>
                ))
              )}
            </ul>

            <div className="mt-auto">
              <div className="space-y-2 lg:space-y-4 text-md lg:text-lg">
                <div className="flex justify-between">
                  <span className="text-[#4A5565]">Subtotal:</span>
                  <span className="font-bold text-[#498118]">RM {subtotal.toFixed(2)}</span>
                </div>
                {orderData.requestShipping && shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#4A5565]">Shipping:</span>
                    <span className="font-bold text-[#498118]">
                      {isCalculatingShipping ? 'Calculating...' : `RM ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
              
              <hr className="my-2 lg:my-4 border-t-2 border-[#C39533]" />
              
              <div className="flex justify-between mb-2 lg:mb-4 font-bold text-2xl lg:text-3xl">
                <span className="text-[#101828]">Total:</span>
                <span className="text-[#498118]">RM {total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={!isFormValid ? handleDisabledButtonClick : handleStripeCheckout}
                className={`w-full mb-2 lg:mb-4 p-4 font-bold text-md lg:text-lg text-[#FFFFFF] rounded-md lg:rounded-lg shadow-lg transition ${
                  !isFormValid || isSubmitting
                    ? 'bg-[#498118]/50 cursor-not-allowed' 
                    : 'bg-[#498118] cursor-pointer hover:scale-105 active:scale-95'
                }`}
                aria-disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-center text-sm lg:text-md text-[#4A5565]">
                You won't be charged until the next step.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}