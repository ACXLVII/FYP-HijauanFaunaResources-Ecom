import Header from '@/components/header'
import Footer from '@/components/footer'
import Heading from '@/app/shop/live_grass/product/[slug]/components/sectionHeading'
import Content from '@/app/shop/live_grass/product/[slug]/components/sectionContent'

import { headers } from 'next/headers';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/live_grass/${slug}`, { 
    cache: 'force-cache',
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) {
    return (
      <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
        <Header />
        <main className="pt-21">
          <div className="text-center text-white py-16">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const product = await res.json();

  // Pass productData to your SectionContent or other components
  return ( // Return the product page.
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />

      <main className="pt-21"> {/* padding for header + green bar */}
        { product ? <><Heading product={product} /><Content product={product} /></> : <></>}
      </main>
      
      <Footer />
    </div>
  );
}