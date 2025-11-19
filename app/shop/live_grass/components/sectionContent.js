import React from 'react';

import { headers } from 'next/headers';
import ProductCard from './sectionProductCard'; // adjust path if needed

export default async function SectionContent() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  let products = [];
  try {
    const res = await fetch(`${protocol}://${host}/api/live_grass`, { 
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="bg-[#000000]/50">
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {products.map((product) => (
              <ProductCard key={product.slug || product.id || product.doc_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 lg:py-16">
            <p className="text-[#FFFFFF] text-lg lg:text-xl">No products available at the moment.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}