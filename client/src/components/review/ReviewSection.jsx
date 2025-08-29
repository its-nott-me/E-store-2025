import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'
import orderService from '../../services/order.service'
import reviewService from '../../services/review.service'
import { Link } from 'react-router-dom'

const ReviewSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Check if user has purchased this product
  const { data: canReview } = useQuery({
    queryKey: ['can-review', productId],
    queryFn: async () => {
      if (!isAuthenticated) return { canReview: false }

      const orders = await orderService.getMyOrders()
      const hasPurchased = orders.orders?.some(order => 
        order.orderStatus === 'delivered' &&
        order.items.some(item => item.product === productId)
      )
      
      // Check if user already reviewed
      const reviews = await reviewService.getProductReviews(productId)
      const hasReviewed = reviews.reviews?.some(review => 
        review.user._id === user._id
      )
      
      return { canReview: hasPurchased && !hasReviewed, hasReviewed }
    },
    enabled: isAuthenticated
  })

  return (
    <div>
      {/* Write Review Button */}
      <div className="mb-6">
        {isAuthenticated ? (
          <>
            {canReview?.canReview && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary"
              >
                Write a Review
              </button>
            )}
            {canReview?.hasReviewed && (
              <p className="text-gray-600">
                You have already reviewed this product
              </p>
            )}
            {!canReview?.canReview && !canReview?.hasReviewed && (
              <p className="text-gray-600">
                You can review this product after purchasing and receiving it
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-600">
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
            {' '}to write a review
          </p>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && canReview?.canReview && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <ReviewForm 
            productId={productId} 
            onSuccess={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Review List */}
      <ReviewList productId={productId} />
    </div>
  )
}

export default ReviewSection