import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "ArtificialGrass"));
  const productsArr = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    data.doc_id = doc.id;
    productsArr.push({ id: doc.id, ...data });
  });
  
  // Add cache headers for better performance
  return NextResponse.json(productsArr, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}