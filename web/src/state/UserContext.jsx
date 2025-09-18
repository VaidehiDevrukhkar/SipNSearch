import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, isFirebaseConfigured } from '../lib/firebase.js'

let doc, getDoc, setDoc, onSnapshot
try {
  ({ doc, getDoc, setDoc, onSnapshot } = await import('firebase/firestore'))
} catch {}

const UserContext = createContext({
  profile: null,
  loading: true,
  setRole: async () => {},
})

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth?.currentUser || !onSnapshot) {
      setLoading(false)
      return
    }
    const ref = doc(db, 'users', auth.currentUser.uid)
    const unsub = onSnapshot(ref, (snap) => {
      setProfile({ uid: auth.currentUser.uid, email: auth.currentUser.email, ...(snap.data()||{}) })
      setLoading(false)
    })
    return () => unsub()
  }, [auth?.currentUser?.uid])

  const setRole = async (role) => {
    if (!isFirebaseConfigured || !setDoc) return
    const ref = doc(db, 'users', auth.currentUser.uid)
    await setDoc(ref, { role }, { merge: true })
  }

  return (
    <UserContext.Provider value={{ profile, loading, setRole }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

