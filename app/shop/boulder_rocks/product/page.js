import { redirect } from 'next/navigation';

export default function ProductsRedirect() {
  // Redirect to the main boulder rocks page
  redirect('/shop/boulder_rocks');
}

