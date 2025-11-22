import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RvdXeFg23GXTtGm9n2Rs6Oj5bZbZbS1m8rFleChO6jFzwZdqzOKYSJgoelQXJtcgmMKQR11gC8WDiuHdBcjhHSy00GGtmygqW', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request) {
  try {
    const { items, customerEmail, metadata = {}, shippingCost = 0, requestShipping = false } = await request.json();

    // Prepare session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://hijauanfauna.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://hijauanfauna.com'}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        source: 'website',
      },
    };

    // If shipping is requested and shipping cost is provided, create a shipping rate and add it to the session
    if (requestShipping && shippingCost > 0) {
      // Get currency from the first product's price to ensure it matches
      let currency = 'myr'; // Default to Malaysian Ringgit
      if (items && items.length > 0 && items[0].price) {
        try {
          const price = await stripe.prices.retrieve(items[0].price);
          currency = price.currency;
        } catch (error) {
          console.warn('Could not retrieve price currency, using default:', error);
          // Keep default 'myr' currency
        }
      }

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
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session', details: error.message },
      { status: 500 }
    );
  }
}
