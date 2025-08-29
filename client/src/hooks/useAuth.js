import { useSelector, useDispatch } from 'react-redux'
import { login, logout, register, loadUser } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const loginUser = (credentials) => dispatch(login(credentials))
  const registerUser = (userData) => dispatch(register(userData))
  const logoutUser = () => dispatch(logout())
  const loadCurrentUser = () => dispatch(loadUser())

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    loadUser: loadCurrentUser,
  }
}