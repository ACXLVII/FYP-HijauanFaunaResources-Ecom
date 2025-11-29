import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
  const { slug } = await params;

  // Try to find by slug first
  let q = query(collection(db, "LiveGrass"), where("slug", "==", slug));
  let querySnapshot = await getDocs(q);

  // If not found by slug, try to find by doc_id (document ID)
  if (querySnapshot.empty) {
    try {
      const docRef = doc(db, "LiveGrass", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        data.doc_id = docSnap.id;
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        });
      }
    } catch (error) {
      // If doc_id lookup fails, continue to return 404
    }
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