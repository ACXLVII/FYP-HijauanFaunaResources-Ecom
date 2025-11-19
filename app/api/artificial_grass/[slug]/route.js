import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request, { params }) {
  const { slug } = await params;

  // Query Firestore for the product with the given slug
  const q = query(collection(db, "ArtificialGrass"), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Assuming slug is unique, get the first match
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  data.doc_id = doc.id;

  // Add cache headers for better performance
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}