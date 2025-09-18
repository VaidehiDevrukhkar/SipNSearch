import { DEMO_CAFES, DEMO_REVIEWS, USER_FAVORITES } from './store.js'
import { db, isFirebaseConfigured } from '../lib/firebase.js'
let collection, getDocs, query, orderBy, limit, doc, getDoc
try {
  ({ collection, getDocs, query, orderBy, limit, doc, getDoc } = await import('firebase/firestore'))
} catch {}

export async function getCafeById(id) {
  if (isFirebaseConfigured && doc && getDoc) {
    const snap = await getDoc(doc(db, 'cafes', id))
    if (snap.exists()) return { id: snap.id, ...snap.data() }
  }
  const cafe = DEMO_CAFES.find((c) => c.id === id)
  return cafe || null
}

export async function getAllCafes() {
  if (isFirebaseConfigured && collection && getDocs) {
    const q = query(collection(db, 'cafes'), orderBy('rating', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return [...DEMO_CAFES]
}

export async function getReviewsForCafe(id) {
  return DEMO_REVIEWS.filter((r) => r.cafeId === id)
}

export async function toggleFavorite(uid, cafeId) {
  USER_FAVORITES[uid] = USER_FAVORITES[uid] || new Set()
  if (USER_FAVORITES[uid].has(cafeId)) USER_FAVORITES[uid].delete(cafeId)
  else USER_FAVORITES[uid].add(cafeId)
}

