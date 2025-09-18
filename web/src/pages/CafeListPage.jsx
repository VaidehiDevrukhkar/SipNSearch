import { useEffect, useState } from 'react'
import SearchBar from '../components/search/SearchBar.jsx'
import Filters from '../components/search/Filters.jsx'
import MoodSearch from '../components/search/MoodSearch.jsx'
import CafeCard from '../components/cafes/CafeCard.jsx'
import MapView from '../components/map/MapView.jsx'
import { getAllCafes } from '../services/cafes.js'
import { subscribeToStore } from '../services/store.js'

export default function CafeListPage() {
  const [results, setResults] = useState([])

  useEffect(() => {
    getAllCafes().then(setResults)
    const unsub = subscribeToStore(() => getAllCafes().then(setResults))
    return () => unsub()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <SearchBar onResults={setResults} />
        <MoodSearch onResults={setResults} />
        <Filters onResults={setResults} />
        <div className="grid sm:grid-cols-2 gap-6">
          {results.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      </div>
      <div className="h-[75vh] sticky top-24">
        <MapView cafes={results} />
      </div>
    </div>
  )
}

