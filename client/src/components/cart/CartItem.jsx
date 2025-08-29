import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/outline'
import { useCart } from '../../hooks/useCart'

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart()
  const [updating, setUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return
    setUpdating(true)
    await updateItem(item._id, newQuantity)
    setUpdating(false)
  }

  const handleRemove = async () => {
    await removeItem(item._id)
  }

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          crossOrigin='anonymous'
          src={item.product?.images[0]?.url || '/placeholder.jpg'}
          alt={item.product?.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/product/${item.product?.slug}`}>
                {item.product?.name}
              </Link>
            </h3>
            <p className="ml-4">${item.totalPrice?.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            ${item.price?.toFixed(2)} each
          </p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="px-3 py-1 bg-gray-100 rounded-md">
              {updating ? '...' : item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating || item.quantity >= item.product?.stock}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="font-medium text-red-600 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </li>
  )
}

export default CartItem