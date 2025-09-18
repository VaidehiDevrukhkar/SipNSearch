import { useState } from 'react'
import { applyFilters } from '../../services/search.js'
import Select from '../ui/Select.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'

export default function Filters({ onResults }) {
  const [filters, setFilters] = useState({
    price: '', rating: '',
    wifiSpeed: '', petFriendly: false, outdoorSeating: false,
    ecoFriendly: false, studentDiscount: false,
  })

  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }))

  const run = async () => {
    onResults(await applyFilters(filters))
  }

  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <Select value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
          <option value="">Any Price</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
        </Select>
        <Select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
          <option value="">Any Rating</option>
          <option value="4">4★+</option>
          <option value="4.5">4.5★+</option>
        </Select>
        <Input placeholder="Min Wi‑Fi Mbps" value={filters.wifiSpeed} onChange={(e) => setFilters({ ...filters, wifiSpeed: e.target.value })} />
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {[
          ['petFriendly', 'Pet-friendly'],
          ['outdoorSeating', 'Outdoor seating'],
          ['ecoFriendly', 'Eco-friendly'],
          ['studentDiscount', 'Student discount'],
        ].map(([key, label]) => (
          <button key={key} type="button" className={`px-3 py-1 rounded-lg border ${filters[key] ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50'}`} onClick={() => toggle(key)}>{label}</button>
        ))}
      </div>
      <Button variant="secondary" onClick={run}>Apply Filters</Button>
    </div>
  )
}

