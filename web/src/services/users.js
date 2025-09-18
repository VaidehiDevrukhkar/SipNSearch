import { DEMO_USERS, USER_FAVORITES, DEMO_REVIEWS } from './store.js'

export async function getUserProfile(uid) {
  const user = DEMO_USERS[uid] || { uid, displayName: 'Demo User', points: 0, badges: [] }
  const favorites = Array.from(USER_FAVORITES[uid] || [])
  const reviews = DEMO_REVIEWS.filter((r) => r.authorId === uid)
  return { ...user, favorites, reviews }
}

