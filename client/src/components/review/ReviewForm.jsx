import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StarIcon } from '@heroicons/react/solid'
import { StarIcon as StarOutline } from '@heroicons/react/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import reviewService from '../../services/review.service'
import toast from 'react-hot-toast'

const ReviewForm = ({ productId, onSuccess, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: existingReview?.title || '',
      comment: existingReview?.comment || ''
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => {
      if (existingReview) {
        return reviewService.updateReview(existingReview._id, data)
      }
      return reviewService.addReview(productId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['product-reviews', productId])
      queryClient.invalidateQueries(['product', productId])
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!')
      if (onSuccess) onSuccess()
      if (!existingReview) {
        reset()
        setRating(0)
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  })

  const onSubmit = (data) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    mutation.mutate({ ...data, rating })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              {star <= (hoveredRating || rating) ? (
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutline className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 && `${rating} out of 5`}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Title
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="input-field"
          placeholder="Summarize your experience"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          {...register('comment', { 
            required: 'Review comment is required',
            minLength: { value: 10, message: 'Review must be at least 10 characters' }
          })}
          rows={4}
          className="input-field"
          placeholder="Share your experience with this product"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="btn-primary w-full"
      >
        {mutation.isLoading 
          ? 'Submitting...' 
          : existingReview ? 'Update Review' : 'Submit Review'
        }
      </button>
    </form>
  )
}

export default ReviewForm