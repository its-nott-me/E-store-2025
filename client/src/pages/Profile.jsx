import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import userService from '../services/user.service'
import toast from 'react-hot-toast'
import authService from '../services/auth.service'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      phoneNumber: user?.phoneNumber,
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await userService.updateProfile(data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      await userService.updateAvatar(file)
      toast.success('Avatar updated successfully')
      window.location.reload() // Reload to show new avatar
    } catch (error) {
      toast.error('Failed to update avatar')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Tabs */}
        <div className="border-b mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
              <div className="flex items-center">
                <img
                  crossOrigin='anonymous'
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                  alt={user?.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="ml-4">
                  <label className="btn-secondary cursor-pointer">
                    Change Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phoneNumber')}
                    className="input-field"
                    maxLength={10}
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}

// Security Tab Component
const SecurityTab = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password updated successfully')
    } catch (error) {
      toast.error('Failed to update password')
      // console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              className="input-field"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="input-field"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === watch('newPassword') || 'Passwords do not match'
              })}
              className="input-field"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile