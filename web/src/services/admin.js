import { DEMO_CAFES, DEMO_REVIEWS, notifyStoreChanged } from './store.js'
import { db, isFirebaseConfigured } from '../lib/firebase.js'
let collection, addDoc, doc, setDoc, serverTimestamp
try {
  ({ collection, addDoc, doc, setDoc, serverTimestamp } = await import('firebase/firestore'))
} catch {}

export async function upsertCafe(cafe) {
  const payload = {
    name: cafe.name || 'Untitled Cafe',
    address: cafe.address || '',
    rating: Number(cafe.rating || 4.2),
    priceLevel: Number(cafe.priceLevel || 2),
    wifiSpeed: Number(cafe.wifiSpeed || 50),
    petFriendly: Boolean(cafe.petFriendly || false),
    outdoorSeating: Boolean(cafe.outdoorSeating || false),
    ecoFriendly: Boolean(cafe.ecoFriendly || false),
    studentDiscount: Boolean(cafe.studentDiscount || false),
    photoUrl: cafe.photoUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    createdAt: isFirebaseConfigured && serverTimestamp ? serverTimestamp() : Date.now(),
  }

  if (isFirebaseConfigured && collection && (addDoc || setDoc)) {
    if (cafe.id && setDoc && doc) {
      await setDoc(doc(db, 'cafes', cafe.id), payload, { merge: true })
    } else if (addDoc) {
      await addDoc(collection(db, 'cafes'), payload)
    }
  } else {
    const existing = DEMO_CAFES.find((c) => c.id === cafe.id || c.name === cafe.name)
    if (existing) Object.assign(existing, payload)
    else DEMO_CAFES.push({ id: 'c' + (DEMO_CAFES.length + 1), ...payload })
  }

  notifyStoreChanged()
}

export async function approveReview(id) {
  const r = DEMO_REVIEWS.find((x) => x.id === id)
  if (r) r.approved = true
}

