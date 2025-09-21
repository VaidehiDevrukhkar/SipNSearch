import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, MapPin, Edit, Trash2, Eye, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCafes } from '../context/CafeContext';
import { db } from '../services/firebase';

const MyReviews = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cafes, getById } = useCafes();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      loadUserReviews();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const loadUserReviews = () => {
    try {
      setLoading(true);
      // Get all reviews from database
      const allReviews = JSON.parse(localStorage.getItem('sns_reviews') || '[]');
      
      // Debug: Check what cafes exist
      const localCafes = db.listCafes();
      console.log('Local storage cafes:', localCafes);
      console.log('Cafe service cafes:', cafes);
      
      // Filter reviews by current user
      const userReviews = allReviews.filter(review => review.userId === user.id);
      
      // Sort by most recent first
      userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(userReviews);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (reviewId) => {
    // Navigate to edit review page or open edit modal
    console.log('Edit review:', reviewId);
    // For now, just show an alert
    alert('Edit functionality coming soon!');
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        db.deleteReview(reviewId);
        // Reload reviews
        loadUserReviews();
        alert('Review deleted successfully!');
      } catch (err) {
        console.error('Error deleting review:', err);
        alert('Failed to delete review');
      }
    }
  };

  const handleViewCafe = (cafeId) => {
    navigate(`/cafe/${cafeId}`);
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
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            {reviews.length === 0 
              ? "You haven't written any reviews yet." 
              : `You've written ${reviews.length} review${reviews.length > 1 ? 's' : ''}.`
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing your cafe experiences by writing your first review!
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium"
            >
              Browse Cafes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              // Get cafe details for this review using the helper function
              const cafe = db.findCafeById(review.cafeId, cafes);
              
              // Debug logging
              console.log('Review:', review);
              console.log('Cafe found:', cafe);
              console.log('CafeId:', review.cafeId);
              
              // Fallback to stored cafe name if cafe not found in database
              const cafeName = cafe ? cafe.name : (review.cafeName || `Cafe ID: ${review.cafeId}`);
              
              return (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Cafe Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {cafeName}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleViewCafe(review.cafeId)}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Cafe</span>
                        </button>
                      </div>

                      {/* Rating and Date */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {review.rating}
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

                      {/* Review Title */}
                      {review.title && (
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {review.title}
                        </h4>
                      )}

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.text}
                      </p>

                      {/* Tags */}
                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="mb-4">
                          <div className="grid grid-cols-3 gap-2">
                            {review.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            ))}
                            {review.images.length > 3 && (
                              <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm text-gray-600">
                                  +{review.images.length - 3} more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Helpful: {review.helpfulCount || 0}</span>
                        <span>•</span>
                        <span>Updated: {formatDate(review.updatedAt || review.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditReview(review.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Review"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyReviews;
