import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function LoginPage() {
  const { signInWithGoogle, registerWithEmail, signInWithEmail } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'register') await registerWithEmail(email, password, displayName)
      else await signInWithEmail(email, password)
    } catch (err) {
      alert(err?.message || 'Authentication error')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{mode === 'register' ? 'Create account' : 'Sign in'}</h1>
        <button className="mt-4 w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700" onClick={async () => {
          try { await signInWithGoogle() } catch (err) { alert(err?.message || 'Google sign-in unavailable') }
        }}>Continue with Google</button>
        <div className="my-4 text-center text-xs text-gray-500">or continue with email</div>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'register' && (
            <input className="border rounded-lg px-3 py-2 w-full" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          )}
          <input className="border rounded-lg px-3 py-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="border rounded-lg px-3 py-2 w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black/90">{mode === 'register' ? 'Register' : 'Sign in'}</button>
        </form>
        <div className="mt-3 text-sm">
          {mode === 'register' ? (
            <button className="underline" onClick={() => setMode('login')}>Already have an account? Sign in</button>
          ) : (
            <button className="underline" onClick={() => setMode('register')}>Need an account? Register</button>
          )}
        </div>
      </div>
    </div>
  )
}

