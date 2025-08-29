import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import orderService from '../services/order.service'
import Loader from '../components/common/Loader'
import { formatDate, getOrderStatusColor } from '../utils/helpers'

const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
  })

  if (isLoading) return <Loader fullScreen />

  const orders = data?.orders || []

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
            <Link to="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        crossOrigin='anonymous'
                        key={item._id}
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-600 text-sm">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders