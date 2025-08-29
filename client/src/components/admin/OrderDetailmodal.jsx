import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { formatDate, getOrderStatusColor } from '../../utils/helpers'

const OrderDetailModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const nextStatus = {
    pending: 'confirmed',
    confirmed: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Order Details - {order.orderNumber}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    {nextStatus[order.orderStatus] && (
                      <button
                        onClick={() => onStatusUpdate(order._id, nextStatus[order.orderStatus])}
                        className="btn-primary text-sm"
                      >
                        Mark as {nextStatus[order.orderStatus]}
                      </button>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <p className="text-sm">{order.user?.name}</p>
                    <p className="text-sm text-gray-600">{order.user?.email}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.phoneNumber}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Product
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Price
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <tr key={item._id}>
                              <td className="px-4 py-2">
                                <div className="flex items-center">
                                  <img
                                    crossOrigin='anonymous'
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="h-10 w-10 rounded object-cover mr-3"
                                  />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center text-sm">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-right text-sm">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-right text-sm">
                                ${item.totalPrice.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>${order.shipping.toFixed(2)}</span>
                      </div>
                      {order.coupon && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({order.coupon.code}):</span>
                          <span>-${order.coupon.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Tracking Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Information</h4>
                      <p className="text-sm">Method: {order.paymentInfo.method}</p>
                      <p className="text-sm">Status: {order.paymentInfo.status}</p>
                      {order.paymentInfo.transactionId && (
                        <p className="text-sm">Transaction ID: {order.paymentInfo.transactionId}</p>
                      )}
                    </div>
                    
                    {order.trackingInfo && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Tracking Information</h4>
                        <p className="text-sm">Carrier: {order.trackingInfo.carrier}</p>
                        <p className="text-sm">Tracking #: {order.trackingInfo.trackingNumber}</p>
                        {order.trackingInfo.trackingUrl && (
                          <a 
                            href={order.trackingInfo.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Track Package
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="text-sm text-gray-500">
                    <p>Ordered: {formatDate(order.createdAt)}</p>
                    {order.deliveredAt && <p>Delivered: {formatDate(order.deliveredAt)}</p>}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default OrderDetailModal