// src/components/CafeCard.jsx
import React, { useState } from 'react';
import { Star, Heart, MapPin, Clock, Wifi, Phone, ExternalLink } from 'lucide-react';

const CafeCard = ({ 
  cafe, 
  onFavorite, 
  onViewDetails, 
  layout = 'grid', // 'grid' or 'list'
  showFullDetails = false 
}) => {
  const [isFavorited, setIsFavorited] = useState(cafe.isFavorited || false);
  const [imageError, setImageError] = useState(false);
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(cafe.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(cafe.id);
  };
  
  const getAmenityIcon = (amenity) => {
    const icons = {
      'wifi': <Wifi className="h-4 w-4" />,
      'pet-friendly': '🐕',
      'outdoor-seating': '🌿',
      'vegan-friendly': '🌱',
      'parking': '🅿️',
      'takeaway': '🥤',
      'wheelchair-accessible': '♿',
      'quiet': '🤫',
      'books': '📚',
      'roastery': '☕',
      'specialty-coffee': '☕',
      'garden': '🌻'
    };
    return icons[amenity] || '✨';
  };

  const formatDistance = (distance) => {
    if (typeof distance === 'string') return distance;
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : i < rating
            ? 'text-yellow-400 fill-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // List layout
  if (layout === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0">
            {!imageError ? (
              <img
                src={cafe.image}
                alt={cafe.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl">☕</span>
              </div>
            )}
            
            <button
              onClick={handleFavorite}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                cafe.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {cafe.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{cafe.name}</h3>
              <span className="text-lg font-bold text-rose-400 ml-2">{cafe.price}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {renderStars(cafe.rating)}
                <span className="ml-1 font-medium text-gray-700">{cafe.rating}</span>
              </div>
              <span className="text-gray-500">({cafe.reviews} reviews)</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{formatDistance(cafe.distance)}</span>
            </div>
            
            <p className="text-gray-600 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {cafe.address}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {cafe.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="flex items-center space-x-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs"
                >
                  <span>{getAmenityIcon(amenity)}</span>
                  <span className="capitalize">{amenity.replace('-', ' ')}</span>
                </span>
              ))}
              {cafe.amenities.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{cafe.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
      {/* Image */}
      <div className="relative">
        {!imageError ? (
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-6xl">☕</span>
          </div>
        )}
        
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            cafe.isOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {cafe.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {cafe.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-rose-400 text-white px-2 py-1 text-xs font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{cafe.name}</h3>
          <span className="text-lg font-bold text-rose-400">{cafe.price}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {renderStars(cafe.rating)}
            <span className="ml-1 font-medium text-gray-700">{cafe.rating}</span>
          </div>
          <span className="text-gray-500">({cafe.reviews})</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{formatDistance(cafe.distance)}</span>
        </div>
        
        <p className="text-gray-600 mb-4 flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{cafe.address}</span>
        </p>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cafe.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="flex items-center space-x-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs"
            >
              <span>{getAmenityIcon(amenity)}</span>
              <span className="capitalize">{amenity.replace('-', ' ')}</span>
            </span>
          ))}
        </div>

        {/* Hours (if available) */}
        {cafe.hours && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{cafe.hours}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium"
          >
            View Details
          </button>
          
          {cafe.phone && (
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4 text-gray-600" />
            </button>
          )}
          
          {cafe.website && (
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;