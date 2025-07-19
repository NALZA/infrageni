/**
 * Pattern Rating and Review System
 * User rating, review, and feedback components for infrastructure patterns
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Flag, 
  Award,
  TrendingUp,
  Calendar,
  User,
  Edit3,
  Trash2,
  MoreVertical,
  Filter,
  Sort,
  Check,
  X,
  Heart,
  Reply,
  AlertTriangle,
  Shield,
  Bookmark
} from 'lucide-react';
import { InfrastructurePattern } from '../core/pattern-types';

export interface PatternReview {
  id: string;
  patternId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageContext: string;
  helpfulVotes: number;
  notHelpfulVotes: number;
  replies: PatternReviewReply[];
  tags: string[];
  verified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  moderationStatus: 'approved' | 'pending' | 'rejected';
  reported: boolean;
}

export interface PatternReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  isAuthor: boolean;
  isModerator: boolean;
}

export interface PatternRating {
  patternId: string;
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  trends: {
    lastMonth: number;
    lastWeek: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface RatingSubmission {
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageContext: string;
  tags: string[];
}

interface PatternRatingSystemProps {
  pattern: InfrastructurePattern;
  currentUserId?: string;
  allowReviews?: boolean;
  allowVoting?: boolean;
  showDetailedStats?: boolean;
  compact?: boolean;
  onRatingSubmit?: (rating: RatingSubmission) => void;
  onReviewUpdate?: (reviewId: string, review: Partial<PatternReview>) => void;
  onReviewDelete?: (reviewId: string) => void;
  onReviewReport?: (reviewId: string, reason: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful' | 'featured';
type FilterOption = 'all' | 'verified' | 'recent' | 'critical' | 'positive' | 'negative';

export const PatternRatingSystem: React.FC<PatternRatingSystemProps> = ({
  pattern,
  currentUserId,
  allowReviews = true,
  allowVoting = true,
  showDetailedStats = true,
  compact = false,
  onRatingSubmit,
  onReviewUpdate,
  onReviewDelete,
  onReviewReport
}) => {
  // State management
  const [reviews, setReviews] = useState<PatternReview[]>([]);
  const [patternRating, setPatternRating] = useState<PatternRating | null>(null);
  const [userReview, setUserReview] = useState<PatternReview | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [votedReviews, setVotedReviews] = useState<Map<string, 'up' | 'down'>>(new Map());
  const [reportingReview, setReportingReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [reviewForm, setReviewForm] = useState<RatingSubmission>({
    rating: 5,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
    usageContext: '',
    tags: []
  });

  // Load reviews and ratings
  useEffect(() => {
    loadReviews();
    loadRatings();
  }, [pattern.id]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews];

    // Apply filters
    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter(r => r.verified);
        break;
      case 'recent':
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => r.createdAt > oneWeekAgo);
        break;
      case 'critical':
        filtered = filtered.filter(r => r.rating <= 2);
        break;
      case 'positive':
        filtered = filtered.filter(r => r.rating >= 4);
        break;
      case 'negative':
        filtered = filtered.filter(r => r.rating <= 2);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulVotes - b.notHelpfulVotes) - (a.helpfulVotes - a.notHelpfulVotes);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || 
                 (b.verified ? 1 : 0) - (a.verified ? 1 : 0) ||
                 (b.helpfulVotes - b.notHelpfulVotes) - (a.helpfulVotes - a.notHelpfulVotes);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, sortBy, filterBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Mock data - in real implementation, fetch from API
      const mockReviews: PatternReview[] = [
        {
          id: 'review-1',
          patternId: pattern.id,
          userId: 'user-1',
          userName: 'Sarah Chen',
          userAvatar: '/avatars/sarah.jpg',
          rating: 5,
          title: 'Excellent pattern for microservices',
          content: 'This pattern saved us weeks of setup time. The documentation is clear and the components are well-structured. Highly recommended for teams getting started with microservices architecture.',
          pros: ['Easy to implement', 'Great documentation', 'Scalable design'],
          cons: ['Initial setup can be complex for beginners'],
          usageContext: 'E-commerce platform with 10+ microservices',
          helpfulVotes: 23,
          notHelpfulVotes: 2,
          replies: [],
          tags: ['microservices', 'production', 'scalable'],
          verified: true,
          featured: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          moderationStatus: 'approved',
          reported: false
        },
        {
          id: 'review-2',
          patternId: pattern.id,
          userId: 'user-2',
          userName: 'Mike Rodriguez',
          rating: 4,
          title: 'Good pattern but needs some tweaks',
          content: 'Overall a solid pattern. We used it for our startup and it worked well. Had to make some modifications for our specific use case.',
          pros: ['Flexible architecture', 'Good performance'],
          cons: ['Some components could be better documented', 'Missing monitoring setup'],
          usageContext: 'Startup web application',
          helpfulVotes: 15,
          notHelpfulVotes: 1,
          replies: [
            {
              id: 'reply-1',
              reviewId: 'review-2',
              userId: 'author-1',
              userName: 'Pattern Author',
              content: 'Thanks for the feedback! We\'re working on improving the monitoring documentation in the next version.',
              createdAt: new Date('2024-01-16'),
              isAuthor: true,
              isModerator: false
            }
          ],
          tags: ['startup', 'flexible'],
          verified: false,
          featured: false,
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
          moderationStatus: 'approved',
          reported: false
        }
      ];
      
      setReviews(mockReviews);
      
      // Check if current user has already reviewed
      const existingReview = mockReviews.find(r => r.userId === currentUserId);
      setUserReview(existingReview || null);

    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      // Mock data - in real implementation, fetch from API
      const mockRating: PatternRating = {
        patternId: pattern.id,
        averageRating: 4.2,
        totalReviews: 38,
        distribution: {
          5: 18,
          4: 12,
          3: 5,
          2: 2,
          1: 1
        },
        trends: {
          lastMonth: 4.1,
          lastWeek: 4.3,
          trend: 'up'
        }
      };
      
      setPatternRating(mockRating);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  };

  const submitReview = async () => {
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Clean up form data
      const cleanedForm = {
        ...reviewForm,
        pros: reviewForm.pros.filter(p => p.trim()),
        cons: reviewForm.cons.filter(c => c.trim())
      };

      await onRatingSubmit?.(cleanedForm);
      
      // Reset form
      setReviewForm({
        rating: 5,
        title: '',
        content: '',
        pros: [''],
        cons: [''],
        usageContext: '',
        tags: []
      });
      
      setShowReviewForm(false);
      
      // Reload reviews
      await loadReviews();
      await loadRatings();

    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const voteOnReview = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!allowVoting || !currentUserId) return;

    const currentVote = votedReviews.get(reviewId);
    
    // If clicking the same vote, remove it
    if (currentVote === voteType) {
      setVotedReviews(prev => {
        const newMap = new Map(prev);
        newMap.delete(reviewId);
        return newMap;
      });
    } else {
      // Set new vote
      setVotedReviews(prev => new Map(prev).set(reviewId, voteType));
    }

    // Update review vote counts
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        let helpfulVotes = review.helpfulVotes;
        let notHelpfulVotes = review.notHelpfulVotes;

        // Remove previous vote if exists
        if (currentVote === 'up') helpfulVotes--;
        if (currentVote === 'down') notHelpfulVotes--;

        // Add new vote if not removing
        if (currentVote !== voteType) {
          if (voteType === 'up') helpfulVotes++;
          if (voteType === 'down') notHelpfulVotes++;
        }

        return { ...review, helpfulVotes, notHelpfulVotes };
      }
      return review;
    }));
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const addProOrCon = (type: 'pros' | 'cons') => {
    setReviewForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateProOrCon = (type: 'pros' | 'cons', index: number, value: string) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeProOrCon = (type: 'pros' | 'cons', index: number) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onRate?: (rating: number) => void) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!patternRating || !showDetailedStats) return null;

    const total = patternRating.totalReviews;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = patternRating.distribution[rating as keyof typeof patternRating.distribution];
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-8 text-gray-600">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-600 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {renderStars(pattern.rating, 'sm')}
        <span className="text-sm text-gray-600">
          {pattern.rating.toFixed(1)} ({pattern.reviewCount} reviews)
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {patternRating?.averageRating.toFixed(1) || pattern.rating.toFixed(1)}
              </div>
              {renderStars(patternRating?.averageRating || pattern.rating, 'lg')}
              <div className="text-sm text-gray-600 mt-1">
                {patternRating?.totalReviews || pattern.reviewCount} reviews
              </div>
            </div>

            {showDetailedStats && (
              <div className="flex-1 max-w-xs">
                {renderRatingDistribution()}
              </div>
            )}
          </div>

          {/* Write Review Button */}
          {allowReviews && currentUserId && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>

        {/* Trends */}
        {showDetailedStats && patternRating?.trends && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className={`h-4 w-4 ${
                  patternRating.trends.trend === 'up' ? 'text-green-500' : 
                  patternRating.trends.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span>
                  {patternRating.trends.trend === 'up' ? 'Trending up' : 
                   patternRating.trends.trend === 'down' ? 'Trending down' : 'Stable'}
                </span>
              </div>
              <span>Last week: {patternRating.trends.lastWeek.toFixed(1)}</span>
              <span>Last month: {patternRating.trends.lastMonth.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
          
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              {renderStars(reviewForm.rating, 'lg', true, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your detailed experience with this pattern..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
                {reviewForm.pros.map((pro, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => updateProOrCon('pros', index, e.target.value)}
                      placeholder="What worked well?"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {reviewForm.pros.length > 1 && (
                      <button
                        onClick={() => removeProOrCon('pros', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addProOrCon('pros')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add another pro
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
                {reviewForm.cons.map((con, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => updateProOrCon('cons', index, e.target.value)}
                      placeholder="What could be improved?"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {reviewForm.cons.length > 1 && (
                      <button
                        onClick={() => removeProOrCon('cons', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addProOrCon('cons')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add another con
                </button>
              </div>
            </div>

            {/* Usage Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usage Context</label>
              <input
                type="text"
                value={reviewForm.usageContext}
                onChange={(e) => setReviewForm(prev => ({ ...prev, usageContext: e.target.value }))}
                placeholder="e.g., E-commerce platform, startup MVP, enterprise application..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting || !reviewForm.title.trim() || !reviewForm.content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({filteredAndSortedReviews.length})
          </h3>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Only</option>
              <option value="recent">Recent</option>
              <option value="positive">Positive</option>
              <option value="negative">Critical</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAndSortedReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No reviews yet</h4>
              <p className="text-sm">Be the first to review this pattern!</p>
            </div>
          ) : (
            filteredAndSortedReviews.map(review => (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {review.userAvatar ? (
                      <img 
                        src={review.userAvatar} 
                        alt={review.userName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                        {review.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Award className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {renderStars(review.rating, 'sm')}
                        <span>•</span>
                        <span>{review.createdAt.toLocaleDateString()}</span>
                        {review.usageContext && (
                          <>
                            <span>•</span>
                            <span>{review.usageContext}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center space-x-2">
                    {review.userId === currentUserId && (
                      <>
                        <button
                          onClick={() => setEditingReview(review.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onReviewDelete?.(review.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setReportingReview(review.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>

                {/* Pros and Cons */}
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h6 className="text-sm font-medium text-green-800 mb-2">Pros</h6>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {review.cons.length > 0 && (
                      <div>
                        <h6 className="text-sm font-medium text-red-800 mb-2">Cons</h6>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-red-500 mr-2">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {review.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                {allowVoting && currentUserId && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => voteOnReview(review.id, 'up')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                          votedReviews.get(review.id) === 'up'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpfulVotes})</span>
                      </button>
                      
                      <button
                        onClick={() => voteOnReview(review.id, 'down')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                          votedReviews.get(review.id) === 'down'
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Not helpful ({review.notHelpfulVotes})</span>
                      </button>
                    </div>

                    {review.replies.length > 0 && (
                      <button
                        onClick={() => toggleReviewExpansion(review.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {expandedReviews.has(review.id) ? 'Hide' : 'Show'} replies ({review.replies.length})
                      </button>
                    )}
                  </div>
                )}

                {/* Replies */}
                {expandedReviews.has(review.id) && review.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                    {review.replies.map(reply => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        {reply.userAvatar ? (
                          <img 
                            src={reply.userAvatar} 
                            alt={reply.userName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{reply.userName}</span>
                            {reply.isAuthor && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Author
                              </span>
                            )}
                            {reply.isModerator && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                Mod
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {reply.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};