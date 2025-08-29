import api from './api'

class ProductService {
  async getProducts(params) {
    const response = await api.get('/products', { params })
    return response.data
  }

  async getProduct(slug) {
    const response = await api.get(`/products/${slug}`)
    return response.data
  }

  async getFeaturedProducts() {
    const response = await api.get('/products/featured')
    return response.data
  }

  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  }

  // Admin methods
  async createProduct(productData) {
    const response = await api.post('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async updateProduct(productId, productData) {
    const response = await api.put(`/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`)
    return response.data
  }
}

export default new ProductService()