import { DEMO_REVIEWS } from './store.js'

export async function postReview({ cafeId, rating, text }) {
  const review = {
    id: 'r' + (DEMO_REVIEWS.length + 1),
    cafeId,
    rating,
    text,
    authorName: 'Demo User',
  }
  DEMO_REVIEWS.unshift(review)
  return review
}

