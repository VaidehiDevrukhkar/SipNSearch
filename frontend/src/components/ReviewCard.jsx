// src/components/ReviewCard.jsx
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, MoreHorizontal } from 'lucide-react';

const ReviewCard = ({ 
  review, 
  onHelpful, 
  onReport, 
  canEdit = false, 
  onEdit, 
  onDelete,
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);

  const handleHelpful = () => {
    const newIsHelpful = !isHelpful;
    setIsHelpful(newIsHelpful);
    setHelpfulCount(prev => newIsHelpful ? prev + 1 : Math.max(0, prev - 1));
    onHelpful?.(review.id, newIsHelpful);
  };

  const handleReport = () => {
    onReport?.(review.id);
    setShowMenu(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

  const shouldTruncate = review.text && review.text.length > 200;
  const displayText = shouldTruncate && !isExpanded 
    ? `${review.text.substring(0, 200)}...` 
    : review.text;

  if (compact) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900">{review.user.name}</h4>
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{review.text}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(review.date)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>
          
          {/* User Info & Rating */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-lg font-semibold text-gray-900">{review.user.name}</h4>
              {review.user.isVerified && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  Verified
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-700 ml-1">{review.rating}</span>
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
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              {canEdit && (
                <>
                  <button
                    onClick={() => {
                      onEdit?.(review.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Review
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(review.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete Review
                  </button>
                  <hr className="my-2" />
                </>
              )}
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Review
              </button>
            </div>
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
          <p className="text-gray-700 leading-relaxed">{displayText}</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-2"
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
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    // Handle image click - open modal/lightbox
                    console.log('Open image:', image);
                  }}
                />
                {index === 5 && review.images.length > 6 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">+{review.images.length - 5}</span>
                  </div>
                )}
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
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
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
            className={`flex items-center space-x-2 text-sm transition-colors ${
              isHelpful
                ? 'text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${isHelpful ? 'fill-current' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>
          
          {/* Business Response */}
          {review.businessResponse && (
            <span className="text-sm text-gray-500">• Business responded</span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {review.user.totalReviews && (
            <span>{review.user.totalReviews} reviews</span>
          )}
        </div>
      </div>

      {/* Business Response */}
      {review.businessResponse && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">Response from {review.businessResponse.businessName}</span>
            <span className="text-xs text-gray-500">{formatDate(review.businessResponse.date)}</span>
          </div>
          <p className="text-sm text-gray-700">{review.businessResponse.text}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;