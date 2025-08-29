import api from './api'

class ReviewService {
  async getProductReviews(productId, params) {
    const response = await api.get(`/reviews/product/${productId}`, { params })
    return response.data
  }

  async addReview(productId, reviewData) {
    const response = await api.post(`/reviews/product/${productId}`, reviewData)
    return response.data
  }

  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData)
    return response.data
  }

  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  }

  async markHelpful(reviewId) {
    const response = await api.post(`/reviews/${reviewId}/helpful`)
    return response.data
  }
}

export default new ReviewService()