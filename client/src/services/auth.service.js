import api from './api'

class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const { token, refreshToken, user } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    
    return response.data
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    const { token, refreshToken, user } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    
    return response.data
  }

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  }

  async updatePassword(passwordData) {
    const response = await api.put('/auth/update-password', passwordData)
    return response.data
  }
}

export default new AuthService()