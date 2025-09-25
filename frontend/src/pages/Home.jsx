// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Coffee, Wifi, Heart, Filter, Grid, Map, TrendingUp, Award, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Import components
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CafeCard from '../components/CafeCard';
import MapComponent from '../components/MapComponent';
import EventsCarousel from '../components/EventsCarousel';
import { useCsvCafes } from '../hooks/useCsvCafes';
import { useAuth } from '../context/AuthContext';


// Hero Section Component
const HeroSection = ({ onSearch, searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-rose-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect
          <span className="text-teal-700"> Coffee Spot</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover amazing cafes near you. From cozy corners to bustling roasteries, 
          find the perfect place for your next coffee break.
        </p>
        
        <SearchBar 
          onSearch={onSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Enter location or cafe name..."
        />
        
        <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
          <span className="flex items-center space-x-2">
            <Coffee className="h-5 w-5" />
            <span>500+ Cafes</span>
          </span>
          <span className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Verified Reviews</span>
          </span>
          <span className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Live Location</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Quick Stats Section
const QuickStats = ({ cafes }) => {
  const stats = [
    { icon: Coffee, label: "Cafes Listed", value: `${cafes.length}+`, color: "text-teal-600" },
    { icon: Star, label: "User Reviews", value: `${Math.floor(cafes.length * 15)}+`, color: "text-yellow-500" },
    { icon: MapPin, label: "Cities Covered", value: `${new Set(cafes.map(c => c.city)).size}+`, color: "text-rose-500" },
    { icon: Award, label: "Featured Cafes", value: `${cafes.filter(c => c.featured).length}+`, color: "text-purple-500" }
  ];

  return (
    <div className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Top 10 Cafes Carousel Component
const Top10CafesCarousel = ({ cafes, onCafeSelect, onFavorite }) => {
  const navigate = useNavigate(); // Add this line to fix the navigation issue
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Sort cafes by rating and get top 10
  const top10Cafes = useMemo(() => {
    return [...cafes]
      .sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0))
      .slice(0, 10);
  }, [cafes]);

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, top10Cafes.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  if (top10Cafes.length === 0) return null;

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">Top 10 Cafes</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the highest-rated coffee experiences in your area
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {top10Cafes.map((cafe, index) => (
                <div
                  key={cafe.id}
                  className="flex-none px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="relative">
                    <CafeCard
                      cafe={cafe}
                      onFavorite={onFavorite}
                      onViewDetails={onCafeSelect}
                    />
                    {/* Ranking Badge */}
                    <div className="absolute -top-2 -left-2 bg-teal-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {top10Cafes.length > itemsPerView && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  currentIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer'
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  currentIndex >= maxIndex
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer'
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {top10Cafes.length > itemsPerView && (
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/browse')}
            className="bg-teal-700 text-white px-8 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium"
          >
            View All Cafes
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Home Component
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cafes, loading, error } = useCsvCafes(); // Use CSV-only cafes
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCafes, setDisplayCafes] = useState([]);

  // Use cafes directly from CSV (they already have images and events assigned)
  useEffect(() => {
    if (cafes && cafes.length > 0) {
      setDisplayCafes(cafes);
    }
  }, [cafes]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    navigate(`/browse?search=${encodeURIComponent(term)}`);
  };

  const handleFavorite = (cafeId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    console.log('Toggled favorite for cafe:', cafeId);
    // TODO: Implement favorite functionality with backend
  };

  const handleCafeSelect = (cafeId) => {
    console.log('Attempting to navigate to cafe with ID:', cafeId);
    
    // Find the cafe in displayCafes
    const cafe = displayCafes.find(c => c.id === cafeId);
    
    if (cafe) {
      console.log('Navigating to cafe:', { 
        id: cafeId, 
        name: cafe.name 
      });
      navigate(`/cafe/${cafeId}`);
    } else {
      console.error('Cafe not found for ID:', cafeId);
      navigate(`/cafe/${cafeId}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Cafes...</h2>
            <p className="text-gray-500 mt-2">Getting data from CSV file</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Cafes</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection 
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {/* Quick Stats */}
      <QuickStats cafes={displayCafes} />
      
      {/* Events Carousel */}
      <EventsCarousel cafes={displayCafes} />
      
      {/* Top 10 Cafes Carousel */}
      <Top10CafesCarousel
        cafes={displayCafes}
        onCafeSelect={handleCafeSelect}
        onFavorite={handleFavorite}
      />
    </div>
  );
}