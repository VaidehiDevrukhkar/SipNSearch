import { useState } from 'react'
import { postReview } from '../../services/reviews.js'
import { useAuth } from '../../state/AuthContext.jsx'

export default function ReviewForm({ cafeId, onPosted }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Sign in to post a review')
    await postReview({ cafeId, rating: Number(rating), text })
    setText('')
    onPosted?.()
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2 items-center">
        <label className="text-sm">Rating</label>
        <select className="border rounded-lg px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <textarea className="border rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Share your experience" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black/90">Post Review</button>
    </form>
  )
}

