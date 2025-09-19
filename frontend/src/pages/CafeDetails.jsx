// src/pages/CafeDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Heart, Share2, MapPin, Clock, Phone, Globe, 
  Wifi, Car, Coffee, Users, Volume2, Leaf, Dog, Camera,
  ThumbsUp, MessageCircle, Flag, ChevronLeft, ChevronRight
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';
import ReviewCard from '../components/ReviewCard';

// Mock cafe data - in real app, this would come from API based on cafe ID
const mockCafeDetails = {
  id: 1,
  name: "The Cozy Corner",
  rating: 4.8,
  reviews: 124,
  address: "123 Main St, Downtown Mumbai, MH 400001",
  phone: "+91 98765 43210",
  website: "www.cozycorvner.com",
  email: "hello@cozycorner.com",
  coordinates: { lat: 19.0760, lng: 72.8777 },
  images: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800",
    "https://images.unsplash.com/photo-1442512595711-aca7af5b1b80?w=800"
  ],
  description: "A warm and inviting neighborhood cafe that serves exceptional coffee and homemade pastries. Perfect for working, reading, or catching up with friends in a cozy atmosphere.",
  price: "$$",
  cuisine: ["Coffee", "Pastries", "Light Meals", "Vegan Options"],
  amenities: [
    { id: 'wifi', name: 'Free WiFi', icon: Wifi, available: true },
    { id: 'parking', name: 'Parking', icon: Car, available: true },
    { id: 'outdoor', name: 'Outdoor Seating', icon: Users, available: true },
    { id: 'quiet', name: 'Quiet Environment', icon: Volume2, available: false },
    { id: 'vegan', name: 'Vegan Friendly', icon: Leaf, available: true },
    { id: 'pets', name: 'Pet Friendly', icon: Dog, available: true }
  ],
  hours: {
    Monday: "7:00 AM - 10:00 PM",
    Tuesday: "7:00 AM - 10:00 PM", 
    Wednesday: "7:00 AM - 10:00 PM",
    Thursday: "7:00 AM - 10:00 PM",
    Friday: "7:00 AM - 11:00 PM",
    Saturday: "8:00 AM - 11:00 PM",
    Sunday: "8:00 AM - 9:00 PM"
  },
  currentlyOpen: true,
  featured: true,
  verified: true,
  tags: ["Cozy", "Work-Friendly", "Date Spot", "Family-Friendly"],
  menu: {
    coffee: [
      { name: "Americano", price: "₹120" },
      { name: "Cappuccino", price: "₹150" },
      { name: "Latte", price: "₹180" },
      { name: "Espresso", price: "₹100" }
    ],
    food: [
      { name: "Avocado Toast", price: "₹220" },
      { name: "Croissant", price: "₹80" },
      { name: "Pasta", price: "₹320" },
      { name: "Salad Bowl", price: "₹280" }
    ]
  }
};

const mockReviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      isVerified: true,
      totalReviews: 23
    },
    rating: 5,
    title: "Perfect spot for remote work!",
    text: "I've been coming here regularly for the past few months. The WiFi is reliable, coffee is excellent, and the atmosphere is perfect for getting work done. The staff is friendly and the seating is comfortable.",
    date: "2024-01-15",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300"
    ],
    helpfulCount: 12,
    tags: ["Work-friendly", "Great coffee", "Good WiFi"],
    visitType: "Solo • Work"
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: false,
      totalReviews: 8
    },
    rating: 4,
    text: "Great coffee and pastries! The outdoor seating is lovely during good weather. Service can be a bit slow during peak hours but the quality makes up for it.",
    date: "2024-01-10",
    helpfulCount: 8,
    tags: ["Great coffee", "Outdoor seating"],
    visitType: "Couple • Casual",
    businessResponse: {
      businessName: "The Cozy Corner",
      text: "Thank you for the feedback, Mike! We're working on improving our service speed during busy periods. Hope to see you again soon!",
      date: "2024-01-12"
    }
  }
];

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
const CafeHeader = ({ cafe, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cafe.name,
          text: `Check out ${cafe.name} - a great cafe in Mumbai!`,
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
              onClick={() => setIsFavorited(!isFavorited)}
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
            
            <button className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium">
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
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch cafe details from API using cafeId
    setTimeout(() => {
      setCafe(mockCafeDetails);
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [cafeId]);

  const handleBack = () => {
    // In a real app, use navigate(-1) or navigate('/')
    console.log('Going back...');
  };

  const handleReviewHelpful = (reviewId, isHelpful) => {
    console.log('Review helpful:', reviewId, isHelpful);
  };

  const handleReportReview = (reviewId) => {
    console.log('Report review:', reviewId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cafe Not Found</h2>
          <p className="text-gray-600 mb-6">The cafe you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CafeHeader cafe={cafe} onBack={handleBack} />
      
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImageGallery images={cafe.images} cafeName={cafe.name} />
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{cafe.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {cafe.tags.map((tag, index) => (
                  <span key={index} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Cuisine */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {cafe.cuisine.map((item, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cafe.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-3">
                    <amenity.icon className={`h-5 w-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={amenity.available ? 'text-gray-900' : 'text-gray-400 line-through'}>
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Menu Highlights</h2>
                <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                  View Full Menu
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Coffee</h3>
                  <div className="space-y-2">
                    {cafe.menu.coffee.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Food</h3>
                  <div className="space-y-2">
                    {cafe.menu.food.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews ({cafe.reviews})</h2>
                <button className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                  Write a Review
                </button>
              </div>
              
              {/* Review Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{cafe.rating}</div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(cafe.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{cafe.reviews} reviews</p>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = Math.random() * 80 + 10; // Mock percentages
                    return (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={handleReviewHelpful}
                    onReport={handleReportReview}
                  />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Hours</h3>
                
                {/* Contact Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-medium">Address</p>
                      <p className="text-gray-600 text-sm">{cafe.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">Phone</p>
                      <a href={`tel:${cafe.phone}`} className="text-teal-600 hover:text-teal-700 text-sm">
                        {cafe.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">Website</p>
                      <a 
                        href={`https://${cafe.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 text-sm"
                      >
                        {cafe.website}
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-900 font-medium">Hours</p>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    {Object.entries(cafe.hours).map(([day, hours]) => {
                      const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
                      return (
                        <div key={day} className={`flex justify-between ${isToday ? 'font-medium text-teal-700' : 'text-gray-600'}`}>
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      cafe.currentlyOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cafe.currentlyOpen ? 'Open Now' : 'Closed Now'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <MapComponent
                  cafes={[cafe]}
                  center={cafe.coordinates}
                  zoom={15}
                  height="250px"
                  showControls={false}
                />
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium">
                    Get Directions
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Call Now
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                    <MessageCircle className="h-4 w-4" />
                    <span>Write Review</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>Add Photos</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Flag className="h-4 w-4" />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>

              {/* Similar Cafes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Cafes</h3>
                <div className="space-y-4">
                  {/* Mock similar cafes */}
                  {[
                    { name: "Brew & Books", rating: 4.6, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100" },
                    { name: "Garden Gate", rating: 4.7, image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=100" }
                  ].map((similarCafe, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <img
                        src={similarCafe.image}
                        alt={similarCafe.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{similarCafe.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">{similarCafe.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}