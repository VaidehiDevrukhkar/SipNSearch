import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCafeById, getReviewsForCafe, toggleFavorite } from '../services/cafes.js'
import ReviewForm from '../components/reviews/ReviewForm.jsx'
import ReviewList from '../components/reviews/ReviewList.jsx'
import MapPreview from '../components/map/MapPreview.jsx'
import { useAuth } from '../state/AuthContext.jsx'

export default function CafeDetailsPage() {
  const { id } = useParams()
  const [cafe, setCafe] = useState(null)
  const [reviews, setReviews] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    getCafeById(id).then(setCafe)
    getReviewsForCafe(id).then(setReviews)
  }, [id])

  if (!cafe) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cafe.name}</h1>
          <p className="text-gray-600">{cafe.address}</p>
        </div>
        {user && (
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
            onClick={() => toggleFavorite(user.uid, cafe.id)}
          >
            {cafe.isFavorite ? 'Unfavorite' : 'Save Favorite'}
          </button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <img className="w-full h-72 object-cover rounded-xl shadow" src={cafe.photoUrl} alt={cafe.name} />
        <div className="space-y-3">
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-gray-100 border">Price: {cafe.priceLevel}</span>
            <span className="px-2 py-1 rounded bg-yellow-100 border">Rating: {cafe.rating}</span>
          </div>
          <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-1">
            <p>Wi-Fi: {cafe.wifiSpeed} Mbps</p>
            <p>{cafe.petFriendly ? 'Pet-friendly' : 'No pets'}</p>
            <p>{cafe.outdoorSeating ? 'Outdoor seating' : 'Indoor only'}</p>
            <p>{cafe.ecoFriendly ? 'Eco-friendly' : 'Regular'}</p>
            <p>{cafe.studentDiscount ? 'Student discounts available' : 'No student discount'}</p>
          </div>
        </div>
      </div>

      <MapPreview cafe={cafe} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <ReviewForm cafeId={cafe.id} onPosted={() => getReviewsForCafe(id).then(setReviews)} />
        <ReviewList reviews={reviews} />
      </section>
    </div>
  )
}

