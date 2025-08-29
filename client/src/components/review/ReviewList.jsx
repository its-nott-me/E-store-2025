import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StarIcon, ThumbUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid'
import { ThumbUpIcon as ThumbUpOutline } from '@heroicons/react/outline'
import reviewService from '../../services/review.service'
import ReviewForm from './ReviewForm'
import Loader from '../common/Loader'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ReviewList = ({ productId }) => {
  const { user } = useAuth()
  const [editingReview, setEditingReview] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId, sortBy, currentPage],
    queryFn: () => reviewService.getProductReviews(productId, { 
      sort: sortBy, 
      page: currentPage,
      limit: 5 
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['product-reviews', productId])
      queryClient.invalidateQueries(['product', productId])
      toast.success('Review deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review')
    }
  })

  const helpfulMutation = useMutation({
    mutationFn: reviewService.markHelpful,
    onSuccess: () => {
      queryClient.invalidateQueries(['product-reviews', productId])
    }
  })

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(reviewId)
    }
  }

  const handleHelpful = (reviewId) => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful')
      return
    }
    helpfulMutation.mutate(reviewId)
  }

  if (isLoading) return <Loader />

  const { reviews = [], total = 0, totalPages = 0, ratingDistribution = [] } = data || {}

  return (
    <div>
      {/* Rating Summary */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold mr-2">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </span>
              <div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {total} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution.find(r => r._id === star)?.count || 0
              const percentage = total > 0 ? (count / total) * 100 : 0

              return (
                <div key={star} className="flex items-center">
                  <span className="text-sm w-3">{star}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400 mx-1" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 ml-2 w-10 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">All Reviews ({total})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-4">
            {editingReview === review._id ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Edit Your Review</h4>
                <ReviewForm 
                  productId={productId}
                  existingReview={review}
                  onSuccess={() => setEditingReview(null)}
                />
                <button
                  onClick={() => setEditingReview(null)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`}
                      alt={review.user?.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{review.user?.name}</h4>
                        {review.isVerifiedPurchase && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? '' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {user && user.id === review.user._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingReview(review._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {review.title && (
                  <h5 className="font-medium mt-2">{review.title}</h5>
                )}
                <p className="text-gray-700 mt-1">{review.comment}</p>

                {/* Helpful Button */}
                <div className="mt-3 flex items-center">
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {review.helpful?.users?.includes(user?.id) ? (
                      <ThumbUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ThumbUpOutline className="h-4 w-4 mr-1" />
                    )}
                    Helpful ({review.helpful?.count || 0})
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 border rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default ReviewList