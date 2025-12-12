import { redirect } from 'next/navigation';

export default function ProductsRedirect() {
  // Redirect to the main pebble rocks page
  redirect('/shop/pebble_rocks');
}

