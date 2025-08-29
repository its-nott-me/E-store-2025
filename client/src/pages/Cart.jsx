import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import { ShoppingBagIcon } from '@heroicons/react/outline'

const Cart = () => {
  const { cart, clearCart } = useCart()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Start shopping to add items to your cart</p>
          <Link to="/shop" className="mt-6 inline-block btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Cart Items ({cart.items.length})</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y">
                {cart.items.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cart.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${cart.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? 'FREE' : `$${cart.shipping?.toFixed(2)}`}
                  </span>
                </div>
                {cart.coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({cart.coupon.code})</span>
                    <span>-${cart.coupon.discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total?.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full btn-primary text-center">
                Proceed to Checkout
              </Link>
              
              <Link to="/shop" className="block w-full mt-3 text-center text-primary-600 hover:text-primary-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart