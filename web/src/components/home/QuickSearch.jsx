import { useState } from 'react'
import { quickSearch } from '../../services/search.js'

export default function QuickSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()
    setResults(await quickSearch(query))
  }

  return (
    <section className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input className="border rounded-lg px-3 py-2 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name or location" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white shadow hover:bg-black/90">Search</button>
      </form>
      {results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r) => (
            <div key={r.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow">
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-gray-600">{r.address}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

