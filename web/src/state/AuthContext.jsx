import { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase.js'
let createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, signInWithPopup
try {
  ({
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged,
    signInWithPopup
  } = await import('firebase/auth'))
} catch (e) {
  // firebase not installed yet
}


const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  registerWithEmail: async () => {},
  signInWithEmail: async () => {},
  signOutUser: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !onAuthStateChanged) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !signInWithPopup) throw new Error('Firebase not configured')
    await signInWithPopup(auth, googleProvider)
  }

  const registerWithEmail = async (email, password, displayName) => {
    if (!isFirebaseConfigured || !createUserWithEmailAndPassword) throw new Error('Firebase not configured')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(cred.user, { displayName })
  }

  const signInWithEmail = async (email, password) => {
    if (!isFirebaseConfigured || !signInWithEmailAndPassword) throw new Error('Firebase not configured')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOutUser = async () => {
    if (!isFirebaseConfigured || !signOut) return
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, registerWithEmail, signInWithEmail, signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

