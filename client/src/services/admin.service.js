import api from './api'

class AdminService {
  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard')
    return response.data.stats
  }

  // Products
  async getProducts(params) {
    const response = await api.get('/admin/products', { params })
    return response.data
  }

  async createProduct(productData) {
    const response = await api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async updateProduct(productId, productData) {
    const response = await api.put(`/admin/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async deleteProduct(productId) {
    const response = await api.delete(`/admin/products/${productId}`)
    return response.data
  }

  // Orders
  async getOrders(params) {
    const response = await api.get('/admin/orders', { params })
    return response.data
  }

  async updateOrderStatus(orderId, statusData) {
    const response = await api.put(`/admin/orders/${orderId}/status`, { 
      orderStatus: statusData 
    })
    return response.data
  }

  // Users
  async getUsers(params) {
    const response = await api.get('/admin/users', { params })
    return response.data
  }

  async updateUserStatus(userId, isActive) {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive })
    return response.data
  }

  async getReviews(params) {
    const response = await api.get('/admin/reviews', { params })
    return response.data
  }

  async deleteReview(reviewId) {
    const response = await api.delete(`/admin/reviews/${reviewId}`)
    return response.data
  }
}

export default new AdminService()