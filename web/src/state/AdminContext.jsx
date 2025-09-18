import { createContext, useContext } from 'react'

const AdminContext = createContext({ isAdmin: () => false })

export function AdminProvider({ children }) {
  const ADMIN_EMAIL = (import.meta.env?.VITE_ADMIN_EMAIL || 'admin@sipnsearch.app').toLowerCase()
  const isAdmin = (uidOrEmail) => {
    if (!uidOrEmail) return false
    const value = String(uidOrEmail).toLowerCase()
    return value === ADMIN_EMAIL
  }
  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

