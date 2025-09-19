// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Clock } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Search cafes, locations...",
  showRecentSearches = true,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Coffee shops near me',
    'Artisan coffee',
    'Pet friendly cafes',
    'WiFi cafes downtown'
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions = [
    { type: 'cafe', name: 'The Cozy Corner', address: '123 Main St' },
    { type: 'cafe', name: 'Brew & Books', address: '456 Oak Ave' },
    { type: 'location', name: 'Downtown District' },
    { type: 'location', name: 'Arts Quarter' },
    { type: 'category', name: 'Pet-friendly cafes' },
    { type: 'category', name: 'WiFi-enabled cafes' }
  ];

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to recent searches
      const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 4);
      setRecentSearches(newRecentSearches);
      
      onSearch(searchTerm);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    onSearch(suggestion.name);
    setIsFocused(false);
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    onSearch(search);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    searchRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'cafe':
        return '☕';
      case 'location':
        return '📍';
      case 'category':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            ref={searchRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-12 pr-32 py-4 rounded-full border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-lg bg-white shadow-sm"
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-32 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 bg-teal-700 text-white px-8 py-3 rounded-full hover:bg-teal-800 transition-colors flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Dropdown with suggestions and recent searches */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    {suggestion.address && (
                      <div className="text-sm text-gray-500">{suggestion.address}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && suggestions.length === 0 && (
            <div className="p-2">
              <div className="flex items-center space-x-2 px-3 py-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {suggestions.length === 0 && (!showRecentSearches || recentSearches.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Start typing to search for cafes...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;