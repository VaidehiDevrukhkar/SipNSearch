import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { getUserProfile } from '../services/users.js'

export default function ProfilePage() {
  const { user, signOutUser } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) getUserProfile(user.uid).then(setProfile)
  }, [user])

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-10">Sign in to view your profile.</div>
  if (!profile) return <div className="max-w-3xl mx-auto px-4 py-10">Loading profile...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="text-gray-600">Badges: {profile.badges?.join(', ') || 'None'}</p>
          <p className="text-gray-600">Points: {profile.points || 0}</p>
        </div>
        <button className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-black/90" onClick={signOutUser}>Log out</button>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">Saved Cafes</h2>
        <ul className="list-disc pl-5 space-y-1">
          {(profile.favorites || []).map((cafeId) => (
            <li key={cafeId}>{cafeId}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Review History</h2>
        <ul className="list-disc pl-5 space-y-1">
          {(profile.reviews || []).map((r) => (
            <li key={r.id}>{r.cafeName}: {r.rating}★ - {r.text}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

