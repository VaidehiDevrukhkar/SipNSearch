// src/components/MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Navigation, ZoomIn, ZoomOut, Layers, Heart } from 'lucide-react';

const MapComponent = ({ 
  cafes = [], 
  selectedCafe = null, 
  onCafeSelect, 
  center = { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
  zoom = 13,
  height = '400px',
  showControls = true,
  interactive = true
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [hoveredCafe, setHoveredCafe] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  // Mock map implementation - in a real app, you'd use Google Maps, Mapbox, or Leaflet
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleMarkerClick = (cafe) => {
    onCafeSelect?.(cafe);
  };

  const zoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const zoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 3));
  };

  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  // Calculate position for markers (mock positioning)
  const getMarkerPosition = (cafe, index) => {
    const baseOffset = 0.01;
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return {
      top: `${40 + (row * 15)}%`,
      left: `${30 + (col * 20)}%`
    };
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height }}>
      {/* Mock Map Background */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-100 relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%), 
            linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%), 
            linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md z-10">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">
              Showing {cafes.length} cafes
            </span>
          </div>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-20"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            title="Your Location"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        {/* Cafe Markers */}
        {cafes.map((cafe, index) => {
          const position = getMarkerPosition(cafe, index);
          const isSelected = selectedCafe?.id === cafe.id;
          const isHovered = hoveredCafe?.id === cafe.id;
          
          return (
            <div key={cafe.id}>
              {/* Marker */}
              <button
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-30 ${
                  isSelected ? 'scale-125' : isHovered ? 'scale-110' : 'scale-100'
                }`}
                style={position}
                onClick={() => handleMarkerClick(cafe)}
                onMouseEnter={() => setHoveredCafe(cafe)}
                onMouseLeave={() => setHoveredCafe(null)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  isSelected 
                    ? 'bg-rose-500 text-white' 
                    : cafe.rating >= 4.5
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300'
                }`}>
                  <span className="text-xs font-bold">☕</span>
                </div>
                
                {/* Price badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 text-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{cafe.price?.length || 1}</span>
                </div>
              </button>

              {/* Info Card on Hover */}
              {isHovered && (
                <div
                  className="absolute z-40 bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-64"
                  style={{
                    top: `${parseInt(position.top) - 8}%`,
                    left: `${parseInt(position.left) + 5}%`,
                    transform: 'translateY(-100%)'
                  }}
                >
                  <div className="flex space-x-3">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center hidden">
                      <span className="text-2xl">☕</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{cafe.name}</h4>
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600">{cafe.rating}</span>
                        <span className="text-xs text-gray-500">({cafe.reviews})</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{cafe.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          cafe.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cafe.isOpen ? 'Open' : 'Closed'}
                        </span>
                        <span className="text-sm font-bold text-rose-400">{cafe.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map Controls */}
        {showControls && (
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
            {/* Zoom Controls */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={zoomIn}
                className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={zoomOut}
                className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Center on User */}
            {userLocation && (
              <button
                onClick={centerOnUser}
                className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
                title="Center on My Location"
              >
                <Navigation className="h-4 w-4 text-gray-600" />
              </button>
            )}

            {/* Map Type Toggle */}
            <button
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
              title="Map Layers"
            >
              <Layers className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-600 rounded-full"></div>
              <span className="text-xs text-gray-600">High Rated (4.5+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-600">Other Cafes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Selected</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {cafes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No cafes found in this area</p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search or zoom out to see more results
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {/* You can add a loading state here */}
    </div>
  );
};

export default MapComponent;