import { useState } from 'react'
import { searchCafes } from '../../services/search.js'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'

export default function SearchBar({ onResults }) {
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')

  const run = async (e) => {
    e.preventDefault()
    const results = await searchCafes({ q, location })
    onResults(results)
  }

  return (
    <form onSubmit={run} className="grid sm:grid-cols-3 gap-2">
      <Input placeholder="Name or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
      <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Button type="submit">Search</Button>
    </form>
  )
}

