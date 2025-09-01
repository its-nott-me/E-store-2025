import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/solid'
import { motion } from 'framer-motion'
import { useCart } from '../../hooks/useCart'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [imageLoading, setImageLoading] = useState(true)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product._id)
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader size="small" />
              </div>
            )}
            <img
              crossOrigin='anonymous'
              src={product.images[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                -{discount}%
              </div>
            )}

            {/* Quick Add to Cart */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2 font-semibold hover:bg-white hover:text-black transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratings?.average || 0) ? 'fill-current' : 'fill-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.ratings?.average?.toFixed(1)} ({product.ratings?.count || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard