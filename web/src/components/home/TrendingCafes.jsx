import { useEffect, useState } from 'react'
import { getTrendingCafes } from '../../services/recommendations.js'
import { subscribeToStore } from '../../services/store.js'
import CafeCard from '../cafes/CafeCard.jsx'

export default function TrendingCafes() {
  const [cafes, setCafes] = useState([])
  useEffect(() => {
    getTrendingCafes().then(setCafes)
    const unsub = subscribeToStore(() => getTrendingCafes().then(setCafes))
    return () => unsub()
  }, [])
  if (cafes.length === 0) return null
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trending Cafes</h2>
        <div className="text-sm text-gray-500">Based on reviews and activity</div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((c) => <CafeCard key={c.id} cafe={c} />)}
      </div>
    </section>
  )
}

