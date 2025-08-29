import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import orderService from '../services/order.service'
import Loader from '../components/common/Loader'
import { formatDate, getOrderStatusColor } from '../utils/helpers'
import toast from 'react-hot-toast'

const OrderDetail = () => {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id),
  })

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(id),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      // window.location.reload()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    },
  })

  if (isLoading) return <Loader fullScreen />

  const order = data?.order

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/orders" className="text-primary-600 hover:text-primary-700">
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Order Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                {canCancel && (
                  <button
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isLoading}
                    className="btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Progress */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
            <div className="flex items-center justify-between">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => (
                <div key={status} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm capitalize">{status}</span>
                  {index < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    crossOrigin='anonymous'
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
            <div>
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <p className="text-gray-600">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}`}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}<br />
                Phone: {order.shippingAddress.phoneNumber}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <p className="text-gray-600">
                Method: {order.paymentInfo.method}<br />
                Status: <span className={order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                  {order.paymentInfo.status}
                </span>
              </p>
              {order.trackingInfo && (
                <div className="mt-4">
                  <h4 className="font-medium">Tracking Information</h4>
                  <p className="text-gray-600">
                    Carrier: {order.trackingInfo.carrier}<br />
                    Tracking Number: {order.trackingInfo.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              {order.coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.coupon.code})</span>
                  <span>-${order.coupon.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail