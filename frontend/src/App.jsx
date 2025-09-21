import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CafeDetails from "./pages/CafeDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Browse from "./pages/Browse";
import MyReviews from "./pages/MyReviews";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from './context/AuthContext';
import { CafeProvider } from './context/CafeContext';

function App() {
  return (
    <AuthProvider>
      <CafeProvider>
        <BrowserRouter>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes" element={<Browse />} />
            <Route path="/cafe/:id" element={<CafeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reviews" element={<MyReviews />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CafeProvider>
    </AuthProvider>
  );
}

export default App;
