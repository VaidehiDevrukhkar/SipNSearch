// Firebase initialization (Auth + Firestore + Storage ready for later)
// Ensure you provide env vars in .env (or your hosting env):
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

let initializeApp, getAuth, GoogleAuthProvider, getFirestore, getStorage
try {
  ;({ initializeApp } = await import('firebase/app'))
  ;({ getAuth, GoogleAuthProvider } = await import('firebase/auth'))
  ;({ getFirestore } = await import('firebase/firestore'))
  ;({ getStorage } = await import('firebase/storage'))
} catch (e) {
  // firebase packages not installed yet
}

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  initializeApp &&
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
)

let app = null
let auth = null
let googleProvider = null
let db = null
let storage = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, auth, googleProvider, db, storage }
export default app

