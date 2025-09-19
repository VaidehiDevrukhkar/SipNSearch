// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Coffee, Menu, X, User } from 'lucide-react';
// import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { user, logout } = useContext(AuthContext);

  // Mock user state for demo - replace with actual auth context
  const user = null; // Set to null for logged out, or user object for logged in

  const handleLogout = () => {
    // logout();
    console.log('Logging out...');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8 text-teal-700" />
            <span className="text-2xl font-bold text-gray-900">CafeFinder</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-teal-700 font-medium transition-colors">
              Home
            </a>
            <a href="/cafes" className="text-gray-700 hover:text-teal-700 font-medium transition-colors">
              Browse Cafes
            </a>
            <a href="/about" className="text-gray-700 hover:text-teal-700 font-medium transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-teal-700 font-medium transition-colors">
              Contact
            </a>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-teal-700">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name || 'Profile'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Profile
                      </a>
                      <a href="/favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Favorites
                      </a>
                      <a href="/reviews" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Reviews
                      </a>
                      <hr className="my-2" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-teal-700 font-medium transition-colors">
                  Login
                </a>
                <a href="/signup" className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <a href="/" className="block text-gray-700 hover:text-teal-700 font-medium">
              Home
            </a>
            <a href="/cafes" className="block text-gray-700 hover:text-teal-700 font-medium">
              Browse Cafes
            </a>
            <a href="/about" className="block text-gray-700 hover:text-teal-700 font-medium">
              About
            </a>
            <a href="/contact" className="block text-gray-700 hover:text-teal-700 font-medium">
              Contact
            </a>
            
            <hr className="my-4" />
            
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name || 'Profile'}</span>
                </div>
                <a href="/profile" className="block text-gray-600 hover:text-teal-700 ml-7">
                  My Profile
                </a>
                <a href="/favorites" className="block text-gray-600 hover:text-teal-700 ml-7">
                  My Favorites
                </a>
                <a href="/reviews" className="block text-gray-600 hover:text-teal-700 ml-7">
                  My Reviews
                </a>
                <button 
                  onClick={handleLogout}
                  className="block text-gray-600 hover:text-teal-700 ml-7"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <a href="/login" className="text-gray-700 hover:text-teal-700 font-medium">
                  Login
                </a>
                <a href="/signup" className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;