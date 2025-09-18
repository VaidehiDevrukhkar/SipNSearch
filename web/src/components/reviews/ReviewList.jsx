export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p className="text-sm text-gray-600">No reviews yet.</p>
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="border rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">{r.authorName || 'Anonymous'}</p>
            <span className="text-sm">{r.rating}★</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{r.text}</p>
        </li>
      ))}
    </ul>
  )
}

