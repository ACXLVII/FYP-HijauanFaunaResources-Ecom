import { redirect } from 'next/navigation';

export default function ProductsRedirect() {
  // Redirect to the main decorative plants page
  redirect('/shop/decorative_plants');
}

