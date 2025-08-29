import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../common/Loader'
import { useEffect, useMemo } from 'react'

const AdminRoute = () => {
  const { user, isAuthenticated, loading, loadUser } = useAuth()
  const token = localStorage.getItem("token");

  const shouldRehydrate = useMemo(() => 
    Boolean(token) && !user
  , [token, user])

  useEffect(() => {
    if(shouldRehydrate){
      loadUser();
    }
  }, [shouldRehydrate, loadUser])

  if (loading || shouldRehydrate) {
    return <Loader fullScreen />
  }

  if (!isAuthenticated && !token) { 
    return <Navigate to="/login" replace />
  }

  if(token && !user){
    return <Navigate to="login" replace />
  }

  return user?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  )
}

export default AdminRoute