// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Star, Coffee, Wifi, Heart, Filter, Grid, Map, TrendingUp, Award, Clock } from 'lucide-react';

// Import components
import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CafeCard from '../components/CafeCard';
import MapComponent from '../components/MapComponent';
import { useCafes } from '../context/CafeContext';

// Mock data removed; we now use cafes from context
const mockCafes = [
  {
    id: 1,
    name: "The Cozy Corner",
    rating: 4.8,
    reviews: 124,
    distance: 0.5,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    address: "123 Main St, Downtown Mumbai",
    price: "$$",
    amenities: ["wifi", "pet-friendly", "outdoor-seating"],
    isOpen: true,
    hours: "7:00 AM - 10:00 PM",
    featured: true
  },
  {
    id: 2,
    name: "Brew & Books",
    rating: 4.6,
    reviews: 89,
    distance: 1.2,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    address: "456 Oak Ave, Library District",
    price: "$",
    amenities: ["wifi", "quiet", "books"],
    isOpen: true,
    hours: "8:00 AM - 11:00 PM"
  },
  {
    id: 3,
    name: "Artisan Roasters",
    rating: 4.9,
    reviews: 203,
    distance: 2.1,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    address: "789 Coffee Blvd, Arts Quarter",
    price: "$$$",
    amenities: ["specialty-coffee", "roastery", "wifi"],
    isOpen: false,
    hours: "6:00 AM - 6:00 PM"
  },
  {
    id: 4,
    name: "Garden Gate Cafe",
    rating: 4.7,
    reviews: 156,
    distance: 1.8,
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
    address: "321 Garden St, Green District",
    price: "$$",
    amenities: ["outdoor-seating", "vegan-friendly", "garden"],
    isOpen: true,
    hours: "7:30 AM - 9:00 PM"
  },
  {
    id: 5,
    name: "Urban Grind",
    rating: 4.4,
    reviews: 76,
    distance: 0.8,
    image: "https://images.unsplash.com/photo-1545665225-b23b99e4d45d?w=400",
    address: "654 Business St, Financial District",
    price: "$$",
    amenities: ["wifi", "takeaway", "parking"],
    isOpen: true,
    hours: "6:00 AM - 8:00 PM"
  },
  {
    id: 6,
    name: "Peaceful Beans",
    rating: 4.5,
    reviews: 92,
    distance: 3.2,
    image: "https://images.unsplash.com/photo-1442512595711-aca7af5b1b80?w=400",
    address: "987 Zen Lane, Quiet Quarter",
    price: "$",
    amenities: ["quiet", "meditation", "vegan-friendly"],
    isOpen: true,
    hours: "8:00 AM - 7:00 PM"
  }
];

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
const QuickStats = () => {
  const stats = [
    { icon: Coffee, label: "Cafes Listed", value: "500+", color: "text-teal-600" },
    { icon: Star, label: "User Reviews", value: "12K+", color: "text-yellow-500" },
    { icon: MapPin, label: "Cities Covered", value: "15+", color: "text-rose-500" },
    { icon: Award, label: "Featured Cafes", value: "50+", color: "text-purple-500" }
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

// Filter Bar Component
const FilterBar = ({ view, setView, filters, setFilters, sortBy, setSortBy, totalResults }) => {
  return (
    <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Filters */}
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-700 hidden md:inline">Filters:</span>
            </div>
            
            <select
              value={filters.price}
              onChange={(e) => setFilters({...filters, price: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">All Prices</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Premium</option>
            </select>
            
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
            
            <select
              value={filters.amenity}
              onChange={(e) => setFilters({...filters, amenity: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">All Amenities</option>
              <option value="wifi">WiFi</option>
              <option value="pet-friendly">Pet Friendly</option>
              <option value="outdoor-seating">Outdoor Seating</option>
              <option value="vegan-friendly">Vegan Options</option>
              <option value="quiet">Quiet Environment</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">Open & Closed</option>
              <option value="open">Open Now</option>
            </select>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center justify-between md:justify-end space-x-4">
            <div className="text-sm text-gray-600">
              {totalResults} cafes found
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="name">Sort by Name</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                title="List View"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('map')}
                className={`p-2 rounded-lg transition-colors ${view === 'map' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Map View"
              >
                <Map className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Cafes Section
const FeaturedCafes = ({ cafes, onCafeSelect, onFavorite }) => {
  const featuredCafes = cafes.filter(cafe => cafe.featured).slice(0, 3);
  
  if (featuredCafes.length === 0) return null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Cafes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked favorites that offer exceptional coffee experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCafes.map(cafe => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              onFavorite={onFavorite}
              onViewDetails={onCafeSelect}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-teal-700 text-white px-8 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium">
            View All Featured Cafes
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Home Component
export default function Home() {
  const { cafes, load } = useCafes();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({
    price: '',
    rating: '',
    amenity: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [filteredCafes, setFilteredCafes] = useState([]);
  const visibleCafes = useMemo(() => filteredCafes.slice(0, 10), [filteredCafes]);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    load();
  }, []);

  // Filter and sort cafes
  useEffect(() => {
    let source = cafes || [];
    let filtered = source;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cafe =>
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Array.isArray(cafe.amenities) && cafe.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.price) {
      filtered = filtered.filter(cafe => cafe.price === filters.price);
    }
    
    if (filters.rating) {
      filtered = filtered.filter(cafe => cafe.rating >= parseFloat(filters.rating));
    }
    
    if (filters.amenity) {
      filtered = filtered.filter(cafe => Array.isArray(cafe.amenities) && cafe.amenities.includes(filters.amenity));
    }

    if (filters.status === 'open') {
      filtered = filtered.filter(cafe => cafe.isOpen);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'distance':
      default:
        filtered.sort((a, b) => Number(a.distance ?? 0) - Number(b.distance ?? 0));
        break;
    }
    
    setFilteredCafes(filtered);
  }, [cafes, searchTerm, filters, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleFavorite = (cafeId) => {
    console.log('Toggled favorite for cafe:', cafeId);
    // In a real app, this would update the backend and local state
  };

  const handleCafeSelect = (cafeId) => {
    const cafe = filteredCafes.find(c => c.id === cafeId);
    setSelectedCafe(cafe);
    console.log('Selected cafe:', cafe);
    // In a real app, this would navigate to cafe details page
    // navigate(`/cafe/${cafeId}`);
  };

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
      <QuickStats />
      
      {/* Featured Cafes */}
      <FeaturedCafes 
        cafes={visibleCafes}
        onCafeSelect={handleCafeSelect}
        onFavorite={handleFavorite}
      />
      
      {/* Filter Bar */}
      <FilterBar 
        view={view}
        setView={setView}
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={filteredCafes.length}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' ? (
          <div>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Cafes'}
              </h2>
              {searchTerm && (
                <p className="text-gray-600">
                  Found {filteredCafes.length} cafes matching your search
                </p>
              )}
            </div>
            
            {/* Cafe Grid */}
            {visibleCafes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleCafes.map(cafe => (
                  <CafeCard 
                    key={cafe.id} 
                    cafe={cafe} 
                    onFavorite={handleFavorite}
                    onViewDetails={handleCafeSelect}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-16">
                <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No cafes found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No cafes match your search "${searchTerm}". Try adjusting your filters.`
                    : 'No cafes match your current filters. Try adjusting your criteria.'
                  }
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ price: '', rating: '', amenity: '', status: '' });
                  }}
                  className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          // Map View
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Map View</h2>
              <p className="text-gray-600">
                Click on markers to view cafe details
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <MapComponent 
                  cafes={filteredCafes}
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                  height="600px"
                />
              </div>
              
              {/* Sidebar with selected cafe or cafe list */}
              <div className="lg:col-span-1">
                {selectedCafe ? (
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
                    <div className="mb-4">
                      <button
                        onClick={() => setSelectedCafe(null)}
                        className="text-sm text-teal-600 hover:text-teal-700 mb-2"
                      >
                        ← Back to all cafes
                      </button>
                    </div>
                    <CafeCard 
                      cafe={selectedCafe}
                      onFavorite={handleFavorite}
                      onViewDetails={handleCafeSelect}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Nearby Cafes</h3>
                      <p className="text-sm text-gray-600">{filteredCafes.length} results</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {visibleCafes.map(cafe => (
                        <div 
                          key={cafe.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleCafeSelect(cafe.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={cafe.image}
                              alt={cafe.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 line-clamp-1">{cafe.name}</h4>
                              <div className="flex items-center space-x-1 mb-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-gray-600">{cafe.rating}</span>
                                <span className="text-xs text-gray-500">({cafe.reviews})</span>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1">{cafe.address}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-medium text-rose-400">{cafe.price}</span>
                                <span className="text-sm text-gray-500">{cafe.distance}km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Load More Button (for pagination) */}
        {filteredCafes.length > 12 && view === 'list' && (
          <div className="text-center mt-12">
            <button className="bg-white text-teal-700 border-2 border-teal-700 px-8 py-3 rounded-lg hover:bg-teal-700 hover:text-white transition-colors font-medium">
              Load More Cafes
            </button>
          </div>
        )}
      </div>
      
      {/* <Footer /> */}
    </div>
  );
}