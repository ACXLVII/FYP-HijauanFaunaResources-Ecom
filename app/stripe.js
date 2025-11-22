import { loadStripe } from '@stripe/stripe-js';

// Client-side Stripe instance
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51RvdXeFg23GXTtGmUu9ZoIjunFmomV0Y3clct9iZMw9zzHx8gxJ49p8HKcT7EvWPWJ1SmMOpZCTJOg1iLGkbGPqG00Uk1D2ioc');
  }
  return stripePromise;
};

export default getStripe;