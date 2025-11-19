import { loadStripe } from '@stripe/stripe-js';

// Client-side Stripe instance
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_live_51SAqLkGR5yHhRoiaAgtf65oJm6czKq6OsI4EASyr5jJfNpOB8xx8zW9thsu8rxYnxUUHtpaoi6SmTekxOuRkJifT002k6vOvOn');
  }
  return stripePromise;
};

export default getStripe;