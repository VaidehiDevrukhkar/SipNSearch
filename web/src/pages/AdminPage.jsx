import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useAdmin } from '../state/AdminContext.jsx'
import { upsertCafe, approveReview } from '../services/admin.js'

export default function AdminPage() {
  const { user } = useAuth()
  const { isAdmin } = useAdmin()
  const [form, setForm] = useState({ name: '', address: '' })

  if (!user) return <div className="max-w-4xl mx-auto px-4 py-10">Sign in to access admin.</div>
  if (!isAdmin(user.email)) return <div className="max-w-4xl mx-auto px-4 py-10">You are not an admin.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Add / Edit Cafe</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded p-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => upsertCafe(form)}>Save</button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Moderation</h2>
        <button className="px-4 py-2 rounded bg-rose-600 text-white" onClick={() => approveReview('someReviewId')}>Approve Sample Review</button>
      </section>
    </div>
  )
}

