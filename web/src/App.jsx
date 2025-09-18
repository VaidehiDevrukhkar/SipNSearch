import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import HomePage from './pages/HomePage.jsx'
import CafeListPage from './pages/CafeListPage.jsx'
import CafeDetailsPage from './pages/CafeDetailsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CreateListPage from './pages/CreateListPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'

import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cafes" element={<CafeListPage />} />
            <Route path="/cafes/:id" element={<CafeDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lists/create" element={<CreateListPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

