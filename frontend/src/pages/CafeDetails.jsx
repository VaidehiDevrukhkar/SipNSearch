// src/pages/CafeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Heart, Share2, MapPin, Clock, Phone, Globe, 
  Wifi, Car, Coffee, Users, Volume2, Leaf, Dog, Camera,
  ThumbsUp, MessageCircle, Flag, ChevronLeft, ChevronRight
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import { useCafes } from '../context/CafeContext';
import { getCafeById } from '../services/cafeService';
import { db } from '../services/firebase';

// Utility function to generate cafe images using Unsplash API
const generateCafeImages = (cafeName, count = 5) => {
  const imageQueries = [
    'coffee shop interior',
    'cafe atmosphere',
    'coffee shop seating',
    'cafe exterior',
    'coffee barista',
    'cafe food',
    'latte art',
    'cozy cafe'
  ];
  
  // Use Unsplash Source API for reliable random images
  return Array.from({ length: count }, (_, index) => {
    const query = imageQueries[index % imageQueries.length];
    const seed = cafeName ? cafeName.replace(/\s+/g, '') + index : 'cafe' + index;
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${seed}`;
  });
};

// Function to parse CSV tags and create amenities
const parseAmenities = (tags = '') => {
  // Ensure tags is a string and handle null/undefined cases
  const tagsString = tags != null ? String(tags) : '';
  const tagArray = tagsString.toLowerCase().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  
  const amenityMapping = {
    'wifi': { id: 'wifi', name: 'Free WiFi', icon: Wifi, available: true },
    'parking': { id: 'parking', name: 'Parking', icon: Car, available: true },
    'outdoor': { id: 'outdoor', name: 'Outdoor Seating', icon: Users, available: true },
    'pet': { id: 'pets', name: 'Pet Friendly', icon: Dog, available: true },
    'vegan': { id: 'vegan', name: 'Vegan Options', icon: Leaf, available: true },
    'quiet': { id: 'quiet', name: 'Quiet Environment', icon: Volume2, available: true },
    'work': { id: 'work', name: 'Work Friendly', icon: Coffee, available: true }
  };
  
  const detectedAmenities = [];
  
  // Check for common amenity keywords in tags
  Object.entries(amenityMapping).forEach(([key, amenity]) => {
    if (tagArray.some(tag => tag.includes(key))) {
      detectedAmenities.push(amenity);
    }
  });
  
  // Add some default amenities if none detected
  if (detectedAmenities.length === 0) {
    detectedAmenities.push(
      amenityMapping.wifi,
      amenityMapping.outdoor,
      amenityMapping.vegan
    );
  }
  
  return detectedAmenities;
};

// Function to generate realistic hours based on cafe type and location
const generateHours = (tags = '') => {
  // Ensure tags is a string and handle null/undefined cases
  const tagsString = tags != null ? String(tags) : '';
  const isWorkFriendly = tagsString.toLowerCase().includes('work');
  const isCasual = tagsString.toLowerCase().includes('casual');
  
  if (isWorkFriendly) {
    return {
      Monday: "7:00 AM - 9:00 PM",
      Tuesday: "7:00 AM - 9:00 PM",
      Wednesday: "7:00 AM - 9:00 PM",
      Thursday: "7:00 AM - 9:00 PM",
      Friday: "7:00 AM - 10:00 PM",
      Saturday: "8:00 AM - 10:00 PM",
      Sunday: "8:00 AM - 8:00 PM"
    };
  } else {
    return {
      Monday: "8:00 AM - 8:00 PM",
      Tuesday: "8:00 AM - 8:00 PM",
      Wednesday: "8:00 AM - 8:00 PM",
      Thursday: "8:00 AM - 8:00 PM",
      Friday: "8:00 AM - 9:00 PM",
      Saturday: "9:00 AM - 9:00 PM",
      Sunday: "9:00 AM - 7:00 PM"
    };
  }
};

// Function to generate menu based on cuisine category and price
const generateMenu = (cuisineCategory = '', priceRange = '$$') => {
  const cuisines = cuisineCategory.split(',').map(c => c.trim().toLowerCase());
  
  // Base prices based on price range
  const priceMultiplier = {
    '$': 0.7,
    '$$': 1,
    '$$$': 1.4,
    '$$$$': 1.8
  }[priceRange] || 1;
  
  const menu = {
    coffee: [
      { name: "Espresso", price: `₹${Math.round(80 * priceMultiplier)}` },
      { name: "Americano", price: `₹${Math.round(100 * priceMultiplier)}` },
      { name: "Cappuccino", price: `₹${Math.round(120 * priceMultiplier)}` },
      { name: "Latte", price: `₹${Math.round(140 * priceMultiplier)}` },
      { name: "Cold Brew", price: `₹${Math.round(160 * priceMultiplier)}` }
    ],
    food: []
  };
  
  // Add food items based on cuisine
  if (cuisines.some(c => c.includes('italian'))) {
    menu.food.push(
      { name: "Margherita Pizza", price: `₹${Math.round(280 * priceMultiplier)}` },
      { name: "Pasta Carbonara", price: `₹${Math.round(320 * priceMultiplier)}` }
    );
  }
  
  if (cuisines.some(c => c.includes('continental') || c.includes('western'))) {
    menu.food.push(
      { name: "Club Sandwich", price: `₹${Math.round(220 * priceMultiplier)}` },
      { name: "Caesar Salad", price: `₹${Math.round(260 * priceMultiplier)}` }
    );
  }
  
  if (cuisines.some(c => c.includes('indian'))) {
    menu.food.push(
      { name: "Masala Chai", price: `₹${Math.round(40 * priceMultiplier)}` },
      { name: "Samosa", price: `₹${Math.round(60 * priceMultiplier)}` }
    );
  }
  
  // Default items if no specific cuisine
  if (menu.food.length === 0) {
    menu.food.push(
      { name: "Avocado Toast", price: `₹${Math.round(180 * priceMultiplier)}` },
      { name: "Croissant", price: `₹${Math.round(80 * priceMultiplier)}` },
      { name: "Bagel & Cream Cheese", price: `₹${Math.round(120 * priceMultiplier)}` },
      { name: "Grilled Sandwich", price: `₹${Math.round(160 * priceMultiplier)}` }
    );
  }
  
  return menu;
};

// Function to get coordinates for Indian cities (you can expand this)
const getCityCoordinates = (city, region) => {
  const coordinates = {
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'goa': { lat: 15.2993, lng: 74.1240 }
  };
  
  const cityKey = city?.toLowerCase().trim();
  return coordinates[cityKey] || { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai
};

// Function to check if cafe is currently open
const isCurrentlyOpen = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Most cafes are open between 8 AM to 8 PM
  if (currentDay === 0) { // Sunday
    return currentHour >= 9 && currentHour < 19;
  } else if (currentDay === 6) { // Saturday
    return currentHour >= 8 && currentHour < 21;
  } else { // Weekdays
    return currentHour >= 7 && currentHour < 21;
  }
};

// Main function to transform CSV data to detailed cafe object
const transformCafeData = (csvCafe) => {
  if (!csvCafe) return null;
  
  // Handle different possible field names from CSV
  const cafeName = csvCafe.NAME || csvCafe.name || csvCafe.cafe_name || csvCafe.restaurant_name || 'Unnamed Cafe';
  const rating = parseFloat(csvCafe.RATING || csvCafe.rating || csvCafe.avg_rating) || 4.0;
  const votes = parseInt(csvCafe.VOTES || csvCafe.votes || csvCafe.review_count) || Math.floor(Math.random() * 100) + 10;
  const city = csvCafe.CITY || csvCafe.city || csvCafe.location || 'Mumbai';
  const region = csvCafe.REGION || csvCafe.region || csvCafe.area || 'Downtown';
  const price = csvCafe.PRICE || csvCafe.price || csvCafe.price_range || '$';
  const cuisine = csvCafe.cuisine_category || csvCafe.cuisine || csvCafe.food_type || 'Multi-cuisine';
  const tags = csvCafe.tags || csvCafe.amenities || '';
  
  console.log('Transforming cafe data:', { cafeName, rating, votes, city, region }); // Debug log
  
  // Safely handle tags - ensure it's a string before splitting
  const tagsString = tags != null ? String(tags) : '';
  const tagArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  
  return {
    id: csvCafe.id || cafeName?.replace(/\s+/g, '-').toLowerCase(),
    name: cafeName,
    rating: rating,
    reviews: votes,
    address: `${region}, ${city}, India`,
    phone: `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`,
    website: csvCafe.URL || `www.${cafeName?.replace(/\s+/g, '').toLowerCase()}.com`,
    email: `hello@${cafeName?.replace(/\s+/g, '').toLowerCase()}.com`,
    coordinates: getCityCoordinates(city, region),
    images: generateCafeImages(cafeName),
    description: `A delightful ${cuisine} cafe located in ${region}. Known for its ${csvCafe.RATING_TYPE || 'excellent'} ambiance and quality service. Perfect for ${tagArray.length > 0 ? tagArray.slice(0, 2).join(' and ') : 'dining and relaxation'}.`,
    price: price,
    cuisine: cuisine ? cuisine.split(',').map(c => c.trim()) : ['Coffee', 'Snacks'],
    amenities: parseAmenities(tags),
    hours: generateHours(tags),
    timing: csvCafe.TIMING || csvCafe.timing,
    currentlyOpen: isCurrentlyOpen(),
    featured: rating >= 4.5,
    verified: votes > 50,
    tags: tagArray.length > 0 ? tagArray : ['Cozy', 'Family-Friendly'],
    menu: generateMenu(cuisine, price),
    ratingType: csvCafe.RATING_TYPE || csvCafe.rating_type,
    city: city,
    region: region,
    pageNo: csvCafe['PAGE NO'] || csvCafe.page_no
  };
};

// Image Gallery Component
const ImageGallery = ({ images, cafeName }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-4 gap-2 h-96">
          {/* Main Image */}
          <div className="col-span-2 row-span-2">
            <img
              src={images[0]}
              alt={cafeName}
              className="w-full h-full object-cover rounded-l-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setCurrentImage(0);
                setShowModal(true);
              }}
            />
          </div>
          
          {/* Smaller Images */}
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`${cafeName} ${index + 2}`}
                className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${
                  index === 1 ? 'rounded-tr-lg' : ''
                } ${index === 3 ? 'rounded-br-lg' : ''}`}
                onClick={() => {
                  setCurrentImage(index + 1);
                  setShowModal(true);
                }}
              />
              {index === 3 && images.length > 5 && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-br-lg cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <span className="text-white font-semibold">+{images.length - 4} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* View All Photos Button */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
        >
          <Camera className="h-4 w-4" />
          <span>View all {images.length} photos</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
            >
              ×
            </button>
            
            <img
              src={images[currentImage]}
              alt={`${cafeName} ${currentImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Cafe Header Component
const CafeHeader = ({ cafe, onBack, onToggleFavorite, onWriteReview, isAuthenticated }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cafe.name,
          text: `Check out ${cafe.name} - a great cafe in ${cafe.city}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">{cafe.name}</h1>
                {cafe.verified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
                {cafe.featured && (
                  <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(cafe.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="font-medium text-gray-900">{cafe.rating}</span>
                  <span className="text-gray-500">({cafe.reviews} reviews)</span>
                </div>
                
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{cafe.price}</span>
                
                <span className="text-gray-300">•</span>
                <span className={`text-sm font-medium ${cafe.currentlyOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {cafe.currentlyOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const allowed = isAuthenticated ? true : false;
                if (onToggleFavorite) {
                  const result = onToggleFavorite();
                  if (result === false) return; // parent redirected to login
                } else if (!allowed) {
                  return; // blocked
                }
                setIsFavorited(!isFavorited);
              }}
              className={`p-3 rounded-full transition-colors ${
                isFavorited
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-3 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Share cafe"
            >
              <Share2 className="h-5 w-5" />
            </button>
            
            <button
              onClick={onWriteReview}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium"
            >
              Write Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Cafe Details Component
export default function CafeDetails({ cafeId }) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cafes, getById } = useCafes();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const id = cafeId || params.id;
    let cancelled = false;
    
    async function loadCafeData() {
      setLoading(true);
      try {
        let rawCafeData = null;
        
        console.log('=== DEBUG INFO ===');
        console.log('Looking for cafe with ID:', id);
        console.log('Available cafes count:', cafes?.length || 0);
        console.log('First few cafes:', cafes?.slice(0, 3));
        
        // First try to get from cafe context (CSV cafes)
        if (cafes && cafes.length > 0) {
          // Strategy 1: Direct field matching
          rawCafeData = cafes.find(c => {
            const matches = 
              c.id === id || 
              c.NAME === id || 
              c.name === id ||
              c.restaurant_name === id ||
              c.cafe_name === id ||
              c.NAME?.replace(/\s+/g, '-').toLowerCase() === id ||
              c.name?.replace(/\s+/g, '-').toLowerCase() === id;
            
            if (matches) {
              console.log('Found by direct match:', c);
            }
            return matches;
          });
          
          // Strategy 2: If ID looks like csv_X, try to get by index
          if (!rawCafeData && id && id.startsWith('csv_')) {
            const index = parseInt(id.replace('csv_', ''));
            console.log('Trying index:', index);
            
            if (!isNaN(index)) {
              // Try 0-based index
              if (index < cafes.length) {
                rawCafeData = cafes[index];
                console.log('Found by 0-based index:', rawCafeData);
              }
              // Try 1-based index
              else if (index - 1 >= 0 && index - 1 < cafes.length) {
                rawCafeData = cafes[index - 1];
                console.log('Found by 1-based index:', rawCafeData);
              }
            }
          }
          
          // Strategy 3: If still not found, try finding by any available identifier
          if (!rawCafeData) {
            console.log('Trying to find by any field containing the ID...');
            rawCafeData = cafes.find((c, idx) => {
              const cafeName = c.NAME || c.name || c.restaurant_name || c.cafe_name;
              const cafeId = c.id || `cafe_${idx}`;
              
              console.log(`Checking cafe ${idx}:`, { cafeName, cafeId, originalId: id });
              
              return cafeId === id || 
                     cafeName === id ||
                     `csv_${idx}` === id ||
                     `cafe_${idx}` === id;
            });
            
            if (rawCafeData) {
              console.log('Found by fallback strategy:', rawCafeData);
            }
          }
        }
        
        // If not found, try the cafe service (Firebase)
        if (!rawCafeData && id) {
          console.log('Trying Firebase service...');
          try {
            rawCafeData = await getCafeById(id);
            if (rawCafeData) console.log('Found in Firebase:', rawCafeData);
          } catch (e) {
            console.log('Firebase lookup failed:', e.message);
          }
        }
        
        // If still not found, try the cafe context's getById method
        if (!rawCafeData && id) {
          console.log('Trying context getById...');
          try {
            rawCafeData = await getById(id);
            if (rawCafeData) console.log('Found via context:', rawCafeData);
          } catch (e) {
            console.log('Context getById failed:', e.message);
          }
        }
        
        console.log('Final raw cafe data:', rawCafeData);
        
        if (rawCafeData && !cancelled) {
          console.log('Transforming cafe data...');
          
          // Transform the raw CSV data into detailed cafe object
          const transformedCafe = transformCafeData(rawCafeData);
          console.log('Transformed cafe:', transformedCafe);
          
          setCafe(transformedCafe);
          
          // Load reviews from Firebase
          try {
            const cafeReviews = db.listReviews(transformedCafe.id);
            setReviews(cafeReviews || []);
          } catch (e) {
            console.log('Review loading failed:', e.message);
            setReviews([]);
          }
        } else if (!cancelled) {
          console.log('❌ No cafe data found for ID:', id);
          console.log('Available cafe IDs:', cafes?.map((c, i) => ({
            index: i,
            id: c.id,
            name: c.NAME || c.name,
            csvId: `csv_${i}`
          })));
          setCafe(null);
          setReviews([]);
        }
      } catch (error) {
        console.error('❌ Error loading cafe data:', error);
        if (!cancelled) {
          setCafe(null);
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadCafeData();
    
    return () => {
      cancelled = true;
    };
  }, [cafeId, params.id, cafes, getById]);

  const handleBack = () => {
    navigate(-1);
  };

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleToggleFavorite = () => {
    return requireAuth('favorite');
  };

  const handleReviewHelpful = (reviewId, isHelpful) => {
    console.log('Review helpful:', reviewId, isHelpful);
  };

  const handleReportReview = (reviewId) => {
    console.log('Report review:', reviewId);
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
    setReviewError(null);
  };

  const handleReviewSubmit = async (reviewData) => {
    setReviewLoading(true);
    setReviewError(null);
    
    try {
      const newReview = db.createReview({
        ...reviewData,
        cafeId: cafe.id,
        cafeName: cafe.name
      });
      
      // Update local state
      setReviews(prev => [newReview, ...prev]);
      
      // Update cafe stats
      const cafeReviews = db.listReviews(cafe.id);
      const totalReviews = cafeReviews.length;
      const averageRating = totalReviews > 0 
        ? cafeReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : cafe.rating;
      
      setCafe(prev => ({
        ...prev,
        reviews: totalReviews,
        rating: Math.round(averageRating * 10) / 10
      }));
      
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cafe details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Cafe not found
  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cafe Not Found</h1>
            <p className="text-gray-600 mb-8">The cafe you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={handleBack}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Cafe Header */}
      <CafeHeader
        cafe={cafe}
        onBack={handleBack}
        onToggleFavorite={handleToggleFavorite}
        onWriteReview={handleWriteReview}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={cafe.images} cafeName={cafe.name} />

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{cafe.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {cafe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cafe.amenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div
                      key={amenity.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        amenity.available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu</h2>
              <div className="space-y-6">
                {/* Coffee */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Coffee & Beverages</h3>
                  <div className="space-y-2">
                    {cafe.menu.coffee.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food */}
                {cafe.menu.food.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Food</h3>
                    <div className="space-y-2">
                      {cafe.menu.food.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium text-gray-900">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
                <button
                  onClick={handleWriteReview}
                  className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onHelpful={(isHelpful) => handleReviewHelpful(review.id, isHelpful)}
                      onReport={() => handleReportReview(review.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
                  <button
                    onClick={handleWriteReview}
                    className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    Write First Review
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{cafe.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${cafe.phone}`} className="font-medium text-teal-700 hover:text-teal-800">
                      {cafe.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a 
                      href={`https://${cafe.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-teal-700 hover:text-teal-800"
                    >
                      {cafe.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h3>
              <div className="space-y-2">
                {Object.entries(cafe.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{day}</span>
                    <span className="font-medium text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                <MapComponent
                  cafes={[cafe]}
                  center={cafe.coordinates}
                  zoom={15}
                  height="192px"
                />
              </div>
              <button
                onClick={() => {
                  const query = encodeURIComponent(cafe.address);
                  window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
                }}
                className="w-full mt-3 bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-800 transition-colors"
              >
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>

              {reviewError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-600">{reviewError}</p>
                </div>
              )}

              <ReviewForm
                cafeId={cafe.id}
                cafeName={cafe.name}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
                loading={reviewLoading}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}