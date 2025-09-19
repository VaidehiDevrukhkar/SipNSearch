// src/pages/Profile.jsx
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Save, X, 
  Heart, Star, MessageSquare, Coffee, Award, Settings, LogOut 
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CafeCard from '../components/CafeCard';
import ReviewCard from '../components/ReviewCard';

// Mock user data
const mockUser = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, Maharashtra',
  joinDate: '2023-06-15',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
  bio: 'Coffee enthusiast and cafe explorer. Love discovering hidden gems and cozy spots around the city.',
  stats: {
    reviewsCount: 23,
    favoritesCount: 18,
    photosCount: 45,
    helpfulVotes: 156
  },
  preferences: {
    preferredPrice: '$$',
    favoriteAmenities: ['wifi', 'outdoor-seating', 'quiet'],
    dietaryRestrictions: ['vegan-friendly']
  }
};

const mockFavorites = [
  {
    id: 1,
    name: "The Cozy Corner",
    rating: 4.8,
    reviews: 124,
    distance: 0.5,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    address: "123 Main St, Downtown",
    price: "$$",
    amenities: ["wifi", "pet-friendly", "outdoor-seating"],
    isOpen: true,
    isFavorited: true
  },
  {
    id: 2,
    name: "Artisan Roasters",
    rating: 4.9,
    reviews: 203,
    distance: 2.1,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    address: "789 Coffee Blvd, Arts Quarter",
    price: "$$$",
    amenities: ["specialty-coffee", "roastery", "wifi"],
    isOpen: false,
    isFavorited: true
  }
];

const mockReviews = [
  {
    id: 1,
    cafeId: 1,
    cafeName: "The Cozy Corner",
    rating: 5,
    title: "Perfect spot for remote work!",
    text: "I've been coming here regularly for the past few months. The WiFi is reliable, coffee is excellent, and the atmosphere is perfect for getting work done.",
    date: "2024-01-15",
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300"],
    helpfulCount: 12,
    tags: ["Work-friendly", "Great coffee", "Good WiFi"]
  },
  {
    id: 2,
    cafeId: 2,
    cafeName: "Artisan Roasters",
    rating: 4,
    title: "Great coffee, but pricey",
    text: "The coffee quality here is exceptional, and you can really taste the difference in their single-origin beans. However, it's quite expensive compared to other places.",
    date: "2024-01-10",
    images: [],
    helpfulCount: 8,
    tags: ["Great coffee", "Expensive", "Quality beans"]
  }
];

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
    console.log('Profile updated:', editForm);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = () => {
    console.log('Avatar change clicked');
    // In real app: implement image upload
  };

  const handleFavorite = (cafeId) => {
    console.log('Toggle favorite:', cafeId);
  };

  const handleCafeSelect = (cafeId) => {
    console.log('View cafe:', cafeId);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'favorites', name: 'My Favorites', icon: Heart },
    { id: 'reviews', name: 'My Reviews', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <button
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{user.location}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-600">{user.stats.reviewsCount}</div>
                    <div className="text-xs text-gray-600">Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-500">{user.stats.favoritesCount}</div>
                    <div className="text-xs text-gray-600">Favorites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{user.stats.photosCount}</div>
                    <div className="text-xs text-gray-600">Photos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">{user.stats.helpfulVotes}</div>
                    <div className="text-xs text-gray-600">Helpful</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-white rounded-lg shadow-sm p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                    <button
                      onClick={isEditing ? handleSave : handleEditToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isEditing
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isEditing && (
                    <div className="mb-4 flex justify-end">
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="flex items-center text-gray-900">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {user.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="flex items-center text-gray-900">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {user.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="flex items-center text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="flex items-center text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={editForm.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="flex items-center text-gray-900">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {user.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <p className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio}</p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Price Range</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {user.preferences.preferredPrice}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.favoriteAmenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.dietaryRestrictions.map((restriction) => (
                          <span
                            key={restriction}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                          >
                            {restriction}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Favorite Cafes</h3>
                {mockFavorites.length > 0 ? (
                  <div className="grid gap-6">
                    {mockFavorites.map((cafe) => (
                      <CafeCard
                        key={cafe.id}
                        cafe={cafe}
                        onFavorite={handleFavorite}
                        onSelect={handleCafeSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No favorite cafes yet</p>
                    <p className="text-sm text-gray-400">Start exploring and add some favorites!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Reviews</h3>
                {mockReviews.length > 0 ? (
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400">Share your cafe experiences with others!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates about new cafes and reviews</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Location Services</h4>
                        <p className="text-sm text-gray-500">Allow location access for nearby cafe recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Get notified about cafe updates and promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Public Profile</h4>
                        <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Show Reviews Publicly</h4>
                        <p className="text-sm text-gray-500">Allow others to see your cafe reviews</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;