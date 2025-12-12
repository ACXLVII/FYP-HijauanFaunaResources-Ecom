import { redirect } from 'next/navigation';

export default function ProductsRedirect() {
  // Redirect to the main produce plants page
  redirect('/shop/produce_plants');
}

