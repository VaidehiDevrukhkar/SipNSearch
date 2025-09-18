import { AuthProvider } from './state/AuthContext.jsx'
import { AdminProvider } from './state/AdminContext.jsx'
import { UserProvider } from './state/UserContext.jsx'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

