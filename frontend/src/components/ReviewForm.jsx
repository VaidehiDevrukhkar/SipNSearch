import React, { useState, useEffect } from 'react';
import { Star, X, Camera, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth directly

const ReviewForm = ({ 
  cafeId, 
  cafeName, 
  onSubmit, 
  onCancel, 
  loading = false,
  error = null 
}) => {
  // Get user directly from AuthContext instead of relying on props
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    text: '',
    visitType: '',
    tags: []
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('ReviewForm - Auth Status:', {
      isAuthenticated,
      user,
      userKeys: user ? Object.keys(user) : 'null'
    });
  }, [user, isAuthenticated]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const visitTypes = [
    'Solo • Work',
    'Solo • Casual', 
    'Couple • Date',
    'Couple • Casual',
    'Friends • Group',
    'Family • Kids',
    'Business Meeting'
  ];

  const commonTags = [
    'Great coffee',
    'Good WiFi',
    'Work-friendly',
    'Outdoor seating',
    'Pet-friendly',
    'Quiet environment',
    'Friendly staff',
    'Good food',
    'Affordable',
    'Clean',
    'Fast service',
    'Cozy atmosphere'
  ];

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      alert('Maximum 6 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, { file, dataUrl: e.target.result }]);
          setImagePreview(prev => [...prev, e.target.result]);
        };
        reader.onerror = () => {
          alert(`Error reading file ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (formData.rating === 0) {
      alert('Please select a rating');
      return false;
    }

    if (!formData.text.trim()) {
      alert('Please write a review');
      return false;
    }

    if (formData.text.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated || !user) {
      alert('You must be logged in to submit a review');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        cafeId,
        cafeName,
        userId: user.uid || user.id || user.email,
        user: {
          name: user.displayName || user.name || user.email?.split('@')[0] || 'Anonymous',
          email: user.email || '',
          avatar: user.photoURL || user.avatar || null,
          isVerified: user.emailVerified || false,
          totalReviews: 1
        },
        rating: formData.rating,
        title: formData.title.trim(),
        text: formData.text.trim(),
        visitType: formData.visitType,
        tags: formData.tags,
        images: images.map(img => img.dataUrl),
        date: new Date().toISOString(),
        helpfulCount: 0,
        isHelpful: false
      };

      console.log('Submitting review:', reviewData);
      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className="focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1 transition-all hover:scale-110"
        onClick={() => handleRatingChange(i + 1)}
        onMouseEnter={() => setHoveredStar(i + 1)}
        onMouseLeave={() => setHoveredStar(0)}
        disabled={isSubmitting}
      >
        <Star
          className={`h-8 w-8 transition-all duration-200 ${
            i < (hoveredStar || formData.rating)
              ? 'text-yellow-400 fill-yellow-400 transform scale-110'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  const isFormDisabled = loading || isSubmitting;
  const hasValidUser = isAuthenticated && user;
  const getUserDisplayName = () => {
    if (!user) return 'Not logged in';
    return user.displayName || user.name || user.email?.split('@')[0] || 'Anonymous User';
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-600 mt-1">Share your experience at {cafeName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            disabled={isFormDisabled}
          >
            <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Login Status */}
            {!hasValidUser ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium">Authentication Required</p>
                  <p className="text-amber-700 text-sm mt-1">Please log in to submit your review</p>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/login'}
                    className="mt-2 text-sm text-amber-800 underline hover:text-amber-900"
                  >
                    Go to Login Page
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-800 text-sm">
                  Logged in as <span className="font-medium">{getUserDisplayName()}</span>
                </p>
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars()}
              </div>
              <p className="text-sm text-gray-600">
                {formData.rating > 0 
                  ? `${formData.rating} star${formData.rating > 1 ? 's' : ''} - ${
                      formData.rating === 5 ? 'Excellent' :
                      formData.rating === 4 ? 'Very Good' :
                      formData.rating === 3 ? 'Good' :
                      formData.rating === 2 ? 'Fair' : 'Poor'
                    }`
                  : 'Click to select your rating'
                }
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Review Title <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Great coffee and atmosphere!"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                maxLength={100}
                disabled={isFormDisabled}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.title.length}/100
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="Tell others about your experience at this cafe. What did you love? What could be improved?"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                maxLength={1000}
                disabled={isFormDisabled}
                required
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum 10 characters</span>
                <span className={formData.text.length >= 10 ? 'text-green-600' : ''}>
                  {formData.text.length}/1000
                </span>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Type <span className="text-gray-400">(Optional)</span>
              </label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                disabled={isFormDisabled}
              >
                <option value="">How did you visit?</option>
                {visitTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags <span className="text-gray-400">(Optional)</span>
                <span className="text-xs text-gray-500 ml-2">Select up to 5</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    disabled={isFormDisabled || (!formData.tags.includes(tag) && formData.tags.length >= 5)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.tags.includes(tag)
                        ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {formData.tags.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">{formData.tags.length}/5 tags selected</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isFormDisabled || images.length >= 6}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center space-y-3 ${
                      isFormDisabled || images.length >= 6 ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700'
                    }`}
                  >
                    <Camera className="h-10 w-10 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG up to 10MB each • Maximum 6 photos
                      </p>
                    </div>
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Photos ({imagePreview.length}/6)
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreview.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                            disabled={isFormDisabled}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={isFormDisabled}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isFormDisabled || 
                  formData.rating === 0 || 
                  !formData.text.trim() || 
                  formData.text.trim().length < 10 || 
                  !hasValidUser
                }
                className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;