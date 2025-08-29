import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import orderService from '../services/order.service'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shippingAddress: user?.addresses?.[0] || {},
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const orderData = {
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
      }

      const response = await orderService.createOrder(orderData)
      toast.success('Order placed successfully!')
      await clearCart()
      navigate(`/orders/${response.order._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                <div className={`flex-1 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'
                    }`}>
                      1
                    </div>
                    <span className="ml-2">Shipping</span>
                  </div>
                </div>
                <div className={`flex-1 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'
                    }`}>
                      2
                    </div>
                    <span className="ml-2">Payment</span>
                  </div>
                </div>
                <div className={`flex-1 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'
                    }`}>
                      3
                    </div>
                    <span className="ml-2">Review</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        {...register('shippingAddress.fullName', { required: 'Name is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.fullName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        {...register('shippingAddress.phoneNumber', { required: 'Phone is required' })}
                        className="input-field"
                        type="text"
                        maxLength={10}
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                      />
                      {errors.shippingAddress?.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        {...register('shippingAddress.addressLine1', { required: 'Address is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.addressLine1.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        {...register('shippingAddress.addressLine2')}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        {...register('shippingAddress.city', { required: 'City is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        {...register('shippingAddress.state', { required: 'State is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.state.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        {...register('shippingAddress.country', { required: 'Country is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.country && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        {...register('shippingAddress.postalCode', { required: 'Postal code is required' })}
                        className="input-field"
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-primary"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        type="radio"
                        value="card"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or American Express</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="paypal"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="cod"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>

                  {errors.paymentMethod && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-primary"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-medium mb-2">Items</h3>
                      <div className="space-y-2">
                        {cart?.items.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>${item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-gray-600">
                        {/* Display formatted address */}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-gray-600">
                        {/* Display selected payment method */}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cart?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${cart?.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart?.shipping === 0 ? 'FREE' : `$${cart?.shipping?.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout