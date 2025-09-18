import { useState } from 'react'
import { saveCafeList } from '../services/lists.js'

export default function CreateListPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cafes, setCafes] = useState('')

  const handleSave = async () => {
    const cafeIds = cafes.split(',').map((s) => s.trim()).filter(Boolean)
    await saveCafeList({ title, description, cafeIds })
    alert('List saved!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-bold">Create a Shareable Cafe List</h1>
      <input className="border rounded p-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border rounded p-2 w-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border rounded p-2 w-full" placeholder="Cafe IDs (comma separated)" value={cafes} onChange={(e) => setCafes(e.target.value)} />
      <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={handleSave}>Save List</button>
    </div>
  )
}

