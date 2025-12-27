import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RvdXeFg23GXTtGm9n2Rs6Oj5bZbZbS1m8rFleChO6jFzwZdqzOKYSJgoelQXJtcgmMKQR11gC8WDiuHdBcjhHSy00GGtmygqW', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request) {
  try {
    const { items, customerEmail, metadata = {}, shippingCost = 0, requestShipping = false } = await request.json();

    console.log('Checkout API called with:', {
      itemsCount: items?.length,
      customerEmail,
      requestShipping,
      shippingCost
    });

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Validation failed: No items provided');
      return NextResponse.json(
        { error: 'Invalid items', details: 'No items provided for checkout' },
        { status: 400 }
      );
    }

    // Validate and normalize items - ensure quantity is a number and price is valid
    const normalizedItems = items.map((item, index) => {
      // Convert quantity to number if it's a string
      const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity);
      
      if (!item.price) {
        console.error(`Item ${index} missing price:`, item);
        return null;
      }
      
      // Validate price ID format (should start with "price_")
      if (typeof item.price !== 'string' || !item.price.startsWith('price_')) {
        console.error(`Item ${index} has invalid price ID format:`, item.price);
        return null;
      }
      
      if (!quantity || quantity <= 0 || isNaN(quantity)) {
        console.error(`Item ${index} has invalid quantity:`, item);
        return null;
      }

      return {
        price: item.price,
        quantity: quantity
      };
    }).filter(item => item !== null);

    if (normalizedItems.length === 0) {
      console.error('Validation failed: No valid items after normalization');
      return NextResponse.json(
        { error: 'Invalid items', details: 'All items are missing price or have invalid quantity' },
        { status: 400 }
      );
    }

    if (normalizedItems.length < items.length) {
      console.warn(`Some items were filtered out: ${items.length} -> ${normalizedItems.length}`);
    }

    // Validate customer email
    if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email', details: 'A valid customer email is required' },
        { status: 400 }
      );
    }

    // Prepare session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: normalizedItems,
      mode: 'payment',
      
      // Add discounts array with your coupon ID
      discounts: [{
        coupon: 'coupon_EOY2025', // Replace with your actual coupon ID
      }],

      //LIVE MODE: Uncomment the line below to use the production URL
      // success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://fyp.hijauanfauna.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://fyp.hijauanfauna.com'}/checkout/cancel`,
      //LIVE MODE: Uncomment the line above to use the production URL

      //TEST MODE: Uncomment the line below to use the localhost URL
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
      //TEST MODE: Uncomment the line above to use the localhost URL

      customer_email: customerEmail,
      metadata: {
        ...metadata,
        source: 'website',
      },
    };

    console.log('Session config prepared:', {
      lineItemsCount: sessionConfig.line_items.length,
      mode: sessionConfig.mode,
      hasShipping: requestShipping && shippingCost > 0
    });

    // If shipping is requested and shipping cost is provided, create a shipping rate and add it to the session
    if (requestShipping && shippingCost > 0) {
      // Get currency from the first product's price to ensure it matches
      let currency = 'myr'; // Default to Malaysian Ringgit
      if (normalizedItems && normalizedItems.length > 0 && normalizedItems[0].price) {
        try {
          const price = await stripe.prices.retrieve(normalizedItems[0].price);
          currency = price.currency;
          console.log('Retrieved currency from price:', currency);
        } catch (error) {
          console.warn('Could not retrieve price currency, using default:', error.message);
          // Keep default 'myr' currency
        }
      }

      try {
        // Create a shipping rate dynamically for this checkout session
        const shippingRate = await stripe.shippingRates.create({
          display_name: 'Standard Shipping',
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingCost * 100), // Convert to cents
            currency: currency,
          },
          metadata: {
            calculated_distance: metadata.distance || '0',
            source: 'dynamic_calculation',
          },
        });

        // Add shipping options to the checkout session
        sessionConfig.shipping_options = [
          {
            shipping_rate: shippingRate.id,
          },
        ];

        // Enable shipping address collection
        sessionConfig.shipping_address_collection = {
          allowed_countries: ['MY'], // Malaysia only
        };
      } catch (shippingError) {
        console.error('Error creating shipping rate:', shippingError);
        return NextResponse.json(
          { error: 'Error creating shipping rate', details: shippingError.message },
          { status: 500 }
        );
      }
    }

    try {
      console.log('Creating Stripe checkout session...');
      const session = await stripe.checkout.sessions.create(sessionConfig);
      console.log('Checkout session created successfully:', session.id);
      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError) {
      console.error('Stripe API Error:', {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        param: stripeError.param,
        raw: stripeError.raw
      });
      
      // Provide more specific error messages based on Stripe error type
      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { 
            error: 'Invalid checkout request', 
            details: stripeError.message,
            code: stripeError.code,
            param: stripeError.param
          },
          { status: 400 }
        );
      }
      
      if (stripeError.type === 'StripeAuthenticationError') {
        return NextResponse.json(
          { 
            error: 'Authentication error', 
            details: 'Invalid Stripe API key. Please check your configuration.'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Error creating checkout session', 
          details: stripeError.message,
          code: stripeError.code
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session', details: error.message },
      { status: 500 }
    );
  }
}
