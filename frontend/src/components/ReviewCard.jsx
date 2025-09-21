// src/components/ReviewCard.jsx
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, MoreHorizontal, Eye, X } from 'lucide-react';

const ReviewCard = ({ 
  review, 
  onHelpful, 
  onReport, 
  canEdit = false, 
  onEdit, 
  onDelete,
  compact = false,
  currentUser = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);

  // Check if current user can edit/delete this review
  const isOwner = currentUser && review.userId && (currentUser.uid === review.userId || currentUser.id === review.userId);
  const showEditOptions = canEdit || isOwner;

  const handleHelpful = () => {
    if (!currentUser) {
      alert('Please log in to mark reviews as helpful');
      return;
    }

    const newIsHelpful = !isHelpful;
    setIsHelpful(newIsHelpful);
    setHelpfulCount(prev => newIsHelpful ? prev + 1 : Math.max(0, prev - 1));
    onHelpful?.(review.id, newIsHelpful);
  };

  const handleReport = () => {
    if (!currentUser) {
      alert('Please log in to report reviews');
      return;
    }
    
    const confirmed = window.confirm('Are you sure you want to report this review?');
    if (confirmed) {
      onReport?.(review.id);
      setShowMenu(false);
      alert('Review has been reported and will be reviewed by our team.');
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
    if (confirmed) {
      onDelete?.(review.id);
      setShowMenu(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recent';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Recent';
    }
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

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!review.images || review.images.length === 0) return;
    
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % review.images.length;
      } else {
        return (prev - 1 + review.images.length) % review.images.length;
      }
    });
  };

  // Handle missing or invalid review data
  if (!review || !review.user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">Review data unavailable</p>
      </div>
    );
  }

  const shouldTruncate = review.text && review.text.length > 200;
  const displayText = shouldTruncate && !isExpanded 
    ? `${review.text.substring(0, 200)}...` 
    : review.text;

  if (compact) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ${review.user.avatar ? 'hidden' : ''}`}>
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {review.user.name || 'Anonymous'}
              </h4>
              <div className="flex items-center flex-shrink-0">
                {renderStars(review.rating || 0)}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{displayText || 'No review text'}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(review.date)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {review.user.avatar ? (
                <img
                  src={review.user.avatar}
                  alt={review.user.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center ${review.user.avatar ? 'hidden' : ''}`}>
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            
            {/* User Info & Rating */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {review.user.name || 'Anonymous'}
                </h4>
                {review.user.isVerified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3 mb-2 flex-wrap">
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating || 0)}
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {review.rating || 0}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(review.date)}
                </div>
                
                {review.visitType && (
                  <span className="text-sm text-gray-500">
                    • {review.visitType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {showEditOptions && (
                    <>
                      <button
                        onClick={() => {
                          onEdit?.(review.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Edit Review
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Delete Review
                      </button>
                      <hr className="my-2" />
                    </>
                  )}
                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Review Title */}
        {review.title && (
          <h5 className="text-lg font-medium text-gray-900 mb-3">{review.title}</h5>
        )}

        {/* Review Text */}
        {review.text && (
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{displayText}</p>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-2 transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        )}

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.images.slice(0, 6).map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openImageModal(index)}
                    onError={(e) => {
                      e.target.className = 'w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center';
                      e.target.innerHTML = '<span class="text-gray-400 text-xs">Image not available</span>';
                    }}
                  />
                  {index === 5 && review.images.length > 6 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer">
                      <span className="text-white font-medium">+{review.images.length - 5}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHelpful}
              disabled={!currentUser}
              className={`flex items-center space-x-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isHelpful
                  ? 'text-teal-600'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
              title={!currentUser ? 'Please log in to mark as helpful' : ''}
            >
              <ThumbsUp className={`h-4 w-4 ${isHelpful ? 'fill-current' : ''}`} />
              <span>Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}</span>
            </button>
            
            {/* Business Response Indicator */}
            {review.businessResponse && (
              <span className="text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Business responded
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {review.user.totalReviews && review.user.totalReviews > 1 && (
              <span>{review.user.totalReviews} reviews</span>
            )}
          </div>
        </div>

        {/* Business Response */}
        {review.businessResponse && (
          <div className="mt-4 bg-teal-50 rounded-lg p-4 border-l-4 border-teal-500">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-teal-900">
                Response from {review.businessResponse.businessName || cafeName}
              </span>
              <span className="text-xs text-teal-600">
                {formatDate(review.businessResponse.date)}
              </span>
            </div>
            <p className="text-sm text-teal-800 leading-relaxed">
              {review.businessResponse.text}
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && review.images && review.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
              aria-label="Close image viewer"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image */}
            <div className="flex items-center justify-center h-full">
              <img
                src={review.images[currentImageIndex]}
                alt={`Review image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.className = 'w-96 h-64 bg-gray-700 rounded-lg flex items-center justify-center';
                  e.target.innerHTML = '<span class="text-white">Image not available</span>';
                }}
              />
            </div>
            
            {/* Navigation */}
            {review.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {review.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;