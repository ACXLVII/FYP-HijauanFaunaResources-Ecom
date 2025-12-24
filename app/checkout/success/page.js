'use client'

import React, { Suspense, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

//Icon Imports
import { TbShoppingBagCheck } from "react-icons/tb";

// Cart Hook
import { useCart } from '@/app/hooks/useCart';

// Firebase imports
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';

// Component that uses useSearchParams
function CheckoutSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSaveError, setOrderSaveError] = useState(false);

  const saveOrderToFirebase = async (sessionData) => {
    try {
      // TEST MODE: Uncomment the line below to simulate an error
      // throw new Error("Test error: Simulating Firebase save failure");

      const { metadata, shipping_details, amount_shipping } = sessionData;
      
      // Parse the products from the metadata
      const products = JSON.parse(metadata.products || '[]');
      
      // Calculate shipping cost - prioritize Stripe's actual shipping amount, then metadata
      // Stripe returns shipping in cents, so divide by 100 to get the actual price
      const stripeShippingCost = amount_shipping ? amount_shipping / 100 : 0;
      const metadataShippingCost = parseFloat(metadata.shippingCost || '0');
      const shippingCost = stripeShippingCost > 0 ? stripeShippingCost : metadataShippingCost;
      
      // Build shippingDetails object
      const requestShipping = metadata.requestShipping === 'true';
      let shippingDetails = {
        requestShipping: requestShipping,
        address: '',
        postcode: '',
        city: '',
        state: '',
        country: '',
        distance: 0,
        shippingCost: shippingCost,
      };

      // If shipping was requested, populate shippingDetails
      // Priority: Use Stripe shipping_details if available, otherwise use metadata addressDetails
      if (requestShipping) {
        // First, try to use Stripe shipping_details (more reliable, collected by Stripe)
        if (shipping_details && shipping_details.address) {
          const stripeAddress = shipping_details.address;
          shippingDetails = {
            requestShipping: true,
            address: stripeAddress.line1 || '',
            addressLine2: stripeAddress.line2 || '',
            postcode: stripeAddress.postal_code || '',
            city: stripeAddress.city || '',
            state: stripeAddress.state || '',
            country: stripeAddress.country || '',
            distance: parseFloat(metadata.distance || '0'),
            shippingCost: shippingCost,
          };
        } 
        // Fallback to metadata addressDetails (from form)
        else if (metadata.addressDetails) {
          try {
            const addressDetails = JSON.parse(metadata.addressDetails);
            shippingDetails = {
              requestShipping: true,
              address: addressDetails.address || '',
              postcode: addressDetails.postcode || '',
              city: addressDetails.city || '',
              state: addressDetails.state || '',
              country: 'MY', // Default to Malaysia
              distance: parseFloat(metadata.distance || '0'),
              shippingCost: shippingCost,
            };
          } catch (error) {
            console.error("Error parsing addressDetails:", error);
          }
        }
      }
      
      const orderData = {
        name: metadata.customerName,
        email: metadata.customerEmail,
        phone: metadata.customerPhone,
        shippingDetails: shippingDetails,
        products: products,
        total: parseFloat(metadata.total),
        paymentStatus: sessionData.payment_status,
        stripeSessionId: sessionData.id,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "Orders"), orderData);
      setOrderSaved(true);
      setOrderSaveError(false);
      setIsProcessing(false);
      toast.success("Order saved successfully!");
      
    } catch (error) {
      console.error("Error saving order to Firebase: ", error);
      setOrderSaveError(true);
      setIsProcessing(false);
      toast.error("Error saving order. Please contact support.");
    }
  };

  useEffect(() => {
    if (sessionId && !orderSaved && !isProcessing && !orderSaveError) {
      setIsProcessing(true);
      
      // Fetch session details and save to Firebase
      fetch(`/api/checkout-session?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setMetadata(data.metadata);
        
        // Save order to Firebase if payment was successful
        if (data.payment_status === 'paid') {
          saveOrderToFirebase(data);
          // Clear cart ONLY after successful payment
          clearCart();
        }
      })
      .catch(err => {
        console.error('Error fetching session:', err);
        toast.error("Error retrieving payment information.");
        setIsProcessing(false);
      });
    }
  }, [sessionId, orderSaved, isProcessing, orderSaveError]);

  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21">

        <div className="bg-[#000000]/50">
          <Toaster position="top-center" />
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
          
            <div className="overflow-hidden max-w-fit mx-auto p-8 lg:p-16 bg-white rounded-lg lg:rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center">
                
                {/* Purchase Completed - Only show if no order confirmation error */}
                {!orderSaveError && (
                  <>
                    <TbShoppingBagCheck className="mb-4 lg:mb-8 size-16 lg:size-24 text-[#498118]" />
                    <h1 className="mb-2 lg:mb-4 font-bold tracking-tight text-2xl lg:text-3xl text-[#101828]">
                      Payment Completed!
                    </h1>
                    <p className="text-center text-md lg:text-lg text-[#4A5565]">
                      Payment Successful.<br/>Your order is being processed. If you have not received your order confirmation within 1 hour, please contact us via WhatsApp.
                    </p>
                  </>
                )}

                {/* Error message when order confirmation generation fails */}
                {orderSaveError && session?.payment_status === 'paid' && (
                  <div className="w-full max-w-md bg-amber-50 border-2 border-amber-300 rounded-lg p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2 lg:mb-3 text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="mb-2 font-bold text-md lg:text-lg text-amber-800">
                        Order Confirmation Issue
                      </h3>
                      <p className="mb-3 lg:mb-4 text-sm lg:text-md text-amber-700">
                        Your payment was successful, but we encountered an issue generating your order confirmation. 
                        Please contact us via WhatsApp with your order details, and we'll assist you immediately.
                      </p>
                      <a
                        href="https://wa.me/601127312673"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                        </svg>
                        Contact Us on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Pending and Completed */}
                {/* {isProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium">
                      🔄 Processing order...
                    </p>
                  </div>
                )}
                {orderSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">
                      ✅ Order successfully saved to database
                    </p>
                  </div>
                )} */}
            
                {/* {metadata && (
                  <div className="text-left text-black bg-gray-50 p-4 rounded-lg border border-cyan-500">
                    <h3 className="font-bold mb-2">Order Details:</h3>
                    <p><strong>Name:</strong> {metadata.customerName}</p>
                    <p><strong>Email:</strong> {metadata.customerEmail}</p>
                    <p><strong>Phone:</strong> {metadata.customerPhone}</p>
                    <p><strong>Shipping:</strong> {metadata.requestShipping === 'true' ? 'Requested' : 'Store Pickup'}</p>
                    <p><strong>Total:</strong> RM {parseFloat(metadata.total || 0).toFixed(2)}</p>
                  </div>
                )} */}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      <main className="pt-21">
        <div className="bg-[#000000]/50">
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
            <div className="overflow-hidden max-w-fit mx-auto p-8 lg:p-16 bg-white rounded-lg lg:rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#498118] mb-4"></div>
                <p className="text-[#4A5565]">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main component with Suspense boundary
export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}