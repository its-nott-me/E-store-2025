import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EyeIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/outline'
import adminService from '../../services/admin.service'
import OrderDetailModal from '../../components/admin/OrderDetailmodal'
import { getOrderStatusColor } from '../../utils/helpers'
import toast from 'react-hot-toast'
import Loader from '../../components/common/Loader'
import { useDebounce } from '../../hooks/useDebounce'

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState({
    status: '',
    searchInput: '',
    page: 1,
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: () => adminService.getOrders(filters),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      toast.success('Order status updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status')
    },
  })

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to update the order status to ${newStatus}?`)) {
      updateStatusMutation.mutate({ orderId, status: newStatus })
    }
  }

  const debouncedSearch = (value) => useDebounce(setFilters({...filters, search: value}), 500)

  // if (isLoading) return <Loader fullScreen />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              debouncedSearch(e.target.value)
            }}
            onKeyDown={(e) => {
              if(e.key === 'Enter') setFilters({...filters, search: searchInput})
            }}
            className="flex-1 input-field"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field w-40"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            className="btn-secondary"
            type="button"
            onClick={() => setFilters({...filters, search: searchInput})}
          >
            Search
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.orders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{order.paymentInfo.method}</span>
                    <br />
                    <span className={`text-xs ${
                      order.paymentInfo.status === 'completed' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {order.paymentInfo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {order.orderStatus === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'processing')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Mark as Processing"
                        >
                          <TruckIcon className="h-5 w-5" />
                        </button>
                      )}
                      {order.orderStatus === 'shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Delivered"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {data?.currentPage} of {data?.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === data?.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

export default AdminOrders