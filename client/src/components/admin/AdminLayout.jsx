import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  LogoutIcon,
  ChatIcon,
  MenuAlt2Icon,
} from '@heroicons/react/outline'
import { useAuth } from '../../hooks/useAuth'

const AdminLayout = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: CubeIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Reviews', href: '/admin/reviews', icon: ChatIcon },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`relative bg-gray-900 text-white transition-all duration-300 ease-in-out ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4">
            {!collapsed && (
              <Link to="/admin" className="text-2xl font-bold">
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-300 hover:text-white"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <MenuAlt2Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-gray-800 text-white border-l-4 border-primary-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex justify-center w-6">
                  <item.icon className="h-5 w-5" />
                </div>
                {!collapsed && item.name}
              </Link>
            ))}
          </nav>

          {/* Footer Links */}
          <div className="absolute bottom-0 w-full p-4">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded"
            >
              <div className="flex justify-center w-6">
                <HomeIcon className="h-5 w-5" />
              </div>
              {!collapsed && 'Back to Store'}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded"
            >
              <div className="flex justify-center w-6">
                <LogoutIcon className="h-5 w-5" />
              </div>
              {!collapsed && 'Logout'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
