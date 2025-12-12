import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// Disable Next.js caching for this route due to large payload size (base64 images)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  const { slug } = await params;

  // Try to find by slug first
  let q = query(collection(db, "ArtificialGrass"), where("slug", "==", slug));
  let querySnapshot = await getDocs(q);

  // If not found by slug, try to find by doc_id (document ID)
  if (querySnapshot.empty) {
    try {
      const docRef = doc(db, "ArtificialGrass", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        data.doc_id = docSnap.id;
        return NextResponse.json(data);
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

  return NextResponse.json(data);
}