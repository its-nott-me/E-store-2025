import api from './api'

class CartService {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  }

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', { productId, quantity })
    return response.data
  }

  async updateCartItem(itemId, quantity) {
    const response = await api.put(`/cart/item/${itemId}`, { quantity })
    return response.data
  }

  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/item/${itemId}`)
    return response.data
  }

  async clearCart() {
    const response = await api.delete('/cart/clear')
    return response.data
  }

  async applyCoupon(code) {
    const response = await api.post('/cart/coupon', { code })
    return response.data
  }
}

export default new CartService()