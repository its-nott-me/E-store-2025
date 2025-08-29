import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import reviewService from '../services/review.service'
import { useAuth } from './useAuth'

export const useProductReviews = (productId, options = {}) => {
  return useQuery({
    queryKey: ['product-reviews', productId, options],
    queryFn: () => reviewService.getProductReviews(productId, options),
    enabled: !!productId,
  })
}

export const useAddReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, reviewData }) => 
      reviewService.addReview(productId, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['product-reviews', variables.productId])
      queryClient.invalidateQueries(['product', variables.productId])
    }
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ reviewId, reviewData }) => 
      reviewService.updateReview(reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['product-reviews'])
      queryClient.invalidateQueries(['product'])
    }
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['product-reviews'])
      queryClient.invalidateQueries(['product'])
    }
  })
}

export const useMarkHelpful = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: reviewService.markHelpful,
    onSuccess: (data, reviewId) => {
      queryClient.invalidateQueries(['product-reviews'])
    }
  })
}

export const useCanReview = (productId) => {
  const { user, isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['can-review', productId, user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return { canReview: false, reason: 'not_authenticated' }
      
      // Check if user has purchased this product
      const orders = await orderService.getMyOrders()
      const hasPurchased = orders.orders?.some(order => 
        order.orderStatus === 'delivered' &&
        order.items.some(item => item.product === productId)
      )
      
      if (!hasPurchased) {
        return { canReview: false, reason: 'not_purchased' }
      }
      
      // Check if user already reviewed
      const reviews = await reviewService.getProductReviews(productId)
      const hasReviewed = reviews.reviews?.some(review => 
        review.user._id === user.id
      )
      
      if (hasReviewed) {
        return { canReview: false, reason: 'already_reviewed' }
      }
      
      return { canReview: true }
    },
    enabled: isAuthenticated && !!productId
  })
}