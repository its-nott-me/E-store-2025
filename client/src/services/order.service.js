import api from './api'

class OrderService {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  }

  async getMyOrders(params) {
    const response = await api.get('/orders/my-orders', { params })
    return response.data
  }

  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  }

  async cancelOrder(orderId) {
    const response = await api.put(`/orders/${orderId}/cancel`)
    return response.data
  }

  // Admin methods
  async getAllOrders(params) {
    const response = await api.get('/admin/orders', { params })
    return response.data
  }

  async updateOrderStatus(orderId, statusData) {
    const response = await api.put(`/admin/orders/${orderId}/status`, statusData)
    return response.data
  }
}

export default new OrderService()