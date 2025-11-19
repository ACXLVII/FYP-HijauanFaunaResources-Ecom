import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('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', {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      amount_shipping: session.total_details?.amount_shipping || 0,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata,
      line_items: session.line_items,
      customer: session.customer,
      shipping_details: session.shipping_details,
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Error retrieving checkout session', details: error.message },
      { status: 500 }
    );
  }
}