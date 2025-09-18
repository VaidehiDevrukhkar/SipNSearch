import { DEMO_CAFES, DEMO_REVIEWS } from './store.js'

export async function getTrendingCafes() {
  const counts = {}
  for (const r of DEMO_REVIEWS) counts[r.cafeId] = (counts[r.cafeId] || 0) + 1
  const ranked = [...DEMO_CAFES].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
  return ranked.slice(0, 6)
}

export async function getPersonalized(uid) {
  // naive: prefer higher rated
  return [...DEMO_CAFES].sort((a, b) => b.rating - a.rating).slice(0, 6)
}

