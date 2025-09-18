// Simple in-memory demo dataset; replace with Firestore queries and AI API
import { DEMO_CAFES } from './store.js'

export async function quickSearch(q) {
  if (!q) return []
  const needle = q.toLowerCase()
  return DEMO_CAFES.filter((c) =>
    c.name.toLowerCase().includes(needle) || c.address.toLowerCase().includes(needle)
  ).slice(0, 6)
}

export async function searchCafes({ q = '', location = '' }) {
  const text = (q + ' ' + location).trim().toLowerCase()
  if (!text) return DEMO_CAFES.slice(0, 12)
  return DEMO_CAFES.filter((c) =>
    c.name.toLowerCase().includes(text) || c.address.toLowerCase().includes(text)
  )
}

export async function applyFilters(filters) {
  return DEMO_CAFES.filter((c) => {
    if (filters.price && String(c.priceLevel) !== String(filters.price)) return false
    if (filters.rating && c.rating < Number(filters.rating)) return false
    if (filters.wifiSpeed && c.wifiSpeed < Number(filters.wifiSpeed)) return false
    for (const key of ['petFriendly','outdoorSeating','ecoFriendly','studentDiscount']) {
      if (filters[key] && !c[key]) return false
    }
    return true
  })
}

export async function moodSearch(prompt) {
  const p = prompt.toLowerCase()
  return DEMO_CAFES.filter((c) => {
    if (p.includes('quiet')) return c.rating >= 4.5 && c.wifiSpeed >= 50
    if (p.includes('date')) return c.outdoorSeating || c.priceLevel >= 2
    if (p.includes('study')) return c.wifiSpeed >= 30 && !c.crowded
    if (p.includes('pet')) return c.petFriendly
    return c.rating >= 4
  }).slice(0, 12)
}

