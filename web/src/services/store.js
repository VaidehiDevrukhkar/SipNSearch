// Demo in-memory data store to make UI functional before Firebase hookup

export const DEMO_CAFES = [
  { id: 'c1', name: 'Brew & Study', address: '123 Main St', priceLevel: 2, rating: 4.6, wifiSpeed: 80, petFriendly: true, outdoorSeating: false, ecoFriendly: true, studentDiscount: true, crowded: false, photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop', lat: 37.7749, lng: -122.4194 },
  { id: 'c2', name: 'Sunset Roasters', address: '45 Sunset Blvd', priceLevel: 3, rating: 4.8, wifiSpeed: 120, petFriendly: false, outdoorSeating: true, ecoFriendly: false, studentDiscount: false, crowded: true, photoUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=800&auto=format&fit=crop', lat: 37.78, lng: -122.41 },
  { id: 'c3', name: 'Quiet Corner Cafe', address: '9 Pine Ave', priceLevel: 1, rating: 4.4, wifiSpeed: 40, petFriendly: true, outdoorSeating: true, ecoFriendly: true, studentDiscount: true, crowded: false, photoUrl: 'https://images.unsplash.com/photo-1461988630841-ccd8715fd14a?q=80&w=800&auto=format&fit=crop', lat: 37.77, lng: -122.42 },
]

export const DEMO_REVIEWS = [
  { id: 'r1', cafeId: 'c1', rating: 5, text: 'Great study vibe and fast Wi‑Fi!', authorName: 'Alex' },
  { id: 'r2', cafeId: 'c2', rating: 4, text: 'Perfect date night ambience.', authorName: 'Sam' },
]

export const DEMO_USERS = {
  u1: { uid: 'u1', displayName: 'Demo User', points: 120, badges: ['Explorer'] },
}

export const USER_FAVORITES = {}
export const DEMO_LISTS = {}

// Simple pub-sub to notify UI when data changes (e.g., admin adds a cafe)
const STORE_LISTENERS = new Set()
export function subscribeToStore(listener) {
  STORE_LISTENERS.add(listener)
  return () => STORE_LISTENERS.delete(listener)
}
export function notifyStoreChanged() {
  for (const l of STORE_LISTENERS) try { l() } catch {}
}

