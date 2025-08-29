import api from './api'

class UserService {
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData)
    return response.data
  }

  async updateAvatar(avatarFile) {
    const formData = new FormData()
    formData.append('image', avatarFile)
    
    const response = await api.put('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async subscribeNewsletter(email) {
    const response = await api.post('/users/subscribe', { email });
    return response.data;
  }
}

export default new UserService()