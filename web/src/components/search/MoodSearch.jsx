import { useState } from 'react'
import { moodSearch } from '../../services/search.js'

export default function MoodSearch({ onResults }) {
  const [prompt, setPrompt] = useState('quiet cafe to study')

  const run = async (e) => {
    e.preventDefault()
    onResults(await moodSearch(prompt))
  }

  return (
    <form onSubmit={run} className="flex gap-2">
      <input className="border rounded p-2 flex-1" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="px-4 py-2 rounded bg-emerald-600 text-white">Mood Search</button>
    </form>
  )
}

