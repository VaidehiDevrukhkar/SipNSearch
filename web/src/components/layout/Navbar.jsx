import { Link } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext.jsx'
import { useAdmin } from '../../state/AdminContext.jsx'

export default function Navbar() {
  const { user, signOutUser } = useAuth()
  const { isAdmin } = useAdmin()

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          <span className="text-indigo-600">Sip</span>NSearch
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/cafes" className="px-3 py-2 rounded-md hover:bg-gray-100">Explore</Link>
          <Link to="/lists/create" className="px-3 py-2 rounded-md hover:bg-gray-100">Create List</Link>
          {user && isAdmin(user.email) && (
            <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-gray-100">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100">Profile</Link>
              <Link to="/onboarding" className="px-3 py-2 rounded-md hover:bg-gray-100">Role</Link>
              <button className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-black/90" onClick={signOutUser}>Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="ml-2 px-4 py-2 rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

