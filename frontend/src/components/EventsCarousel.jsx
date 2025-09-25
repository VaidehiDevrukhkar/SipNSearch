// src/components/EventsCarousel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Coffee, Music, Book, Award, Heart, Zap } from 'lucide-react';

const EventsCarousel = ({ cafes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Get all events from cafes for the current week
  const weeklyEvents = useMemo(() => {
    const allEvents = [];
    cafes.forEach(cafe => {
      if (cafe.events && Array.isArray(cafe.events)) {
        cafe.events.forEach(event => {
          allEvents.push({
            ...event,
            cafeId: cafe.id,
            cafeImage: cafe.image,
            cafeAddress: cafe.address
          });
        });
      }
    });

    // Sort events by day and time
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return allEvents.sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      
      // If same day, sort by time
      const timeA = a.time.includes('AM') ? parseInt(a.time) : parseInt(a.time) + 12;
      const timeB = b.time.includes('AM') ? parseInt(b.time) : parseInt(b.time) + 12;
      return timeA - timeB;
    });
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

  const maxIndex = Math.max(0, weeklyEvents.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const getEventIcon = (type) => {
    const icons = {
      'workshop': <Coffee className="h-5 w-5" />,
      'entertainment': <Music className="h-5 w-5" />,
      'cultural': <Book className="h-5 w-5" />,
      'competition': <Award className="h-5 w-5" />,
      'wellness': <Heart className="h-5 w-5" />,
      'tasting': <Zap className="h-5 w-5" />,
      'educational': <Book className="h-5 w-5" />
    };
    return icons[type] || <Coffee className="h-5 w-5" />;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'entertainment': 'bg-purple-100 text-purple-800',
      'cultural': 'bg-green-100 text-green-800',
      'competition': 'bg-yellow-100 text-yellow-800',
      'wellness': 'bg-pink-100 text-pink-800',
      'tasting': 'bg-orange-100 text-orange-800',
      'educational': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (weeklyEvents.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50 to-teal-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-8 w-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">This Week's Events</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting events happening at cafes near you this week
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
              {weeklyEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-none px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                    {/* Event Image */}
                    <div className="relative h-48">
                      <img
                        src={event.cafeImage || '/vite.svg'}
                        alt={event.cafeName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Event Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)} flex items-center space-x-1`}>
                          {getEventIcon(event.type)}
                          <span className="capitalize">{event.type}</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Event Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                          <span className="font-medium">{event.day}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-teal-600" />
                          <span>{event.time} • {event.duration}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                          <span className="line-clamp-1">{event.cafeName}</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button className="w-full bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-800 transition-colors font-medium text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {weeklyEvents.length > itemsPerView && (
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
        {weeklyEvents.length > itemsPerView && (
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

        {/* Event Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {weeklyEvents.length} events happening this week across {new Set(weeklyEvents.map(e => e.cafeName)).size} cafes
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventsCarousel;
