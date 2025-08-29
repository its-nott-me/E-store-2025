import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tab, TabGroup, TabPanel, TabList, TabPanels } from '@headlessui/react'
import { StarIcon, HeartIcon } from '@heroicons/react/solid'
import { HeartIcon as HeartOutline } from '@heroicons/react/outline'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'
import ReviewSection from '../components/review/ReviewSection'

const ProductPage = () => {
  const { slug } = useParams()
  const { data, isLoading, error } = useProduct(slug)
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  // const [isWishlisted, setIsWishlisted] = useState(false)

  if (isLoading) return <Loader fullScreen />
  if (error) return <div>Error loading product</div>
  
  const product = data?.product

  const handleAddToCart = () => {
    addToCart(product._id, quantity)
  }

  // const handleWishlist = () => {
  //   setIsWishlisted(!isWishlisted)
  //   toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  // }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                crossOrigin='anonymous'
                src={product.images[selectedImage]?.url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    crossOrigin='anonymous'
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.ratings.average) ? '' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.comparePrice}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Save ${(product.comparePrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-gray-700">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                {/* <button
                  onClick={handleWishlist}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  {isWishlisted ? (
                    <HeartIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-600" />
                  )}
                </button> */}
              </div>
            </div>

            {/* Product Tabs */}
            <TabGroup>
              <TabList className="flex space-x-1 border-b">
                <Tab className={({ selected }) =>
                  `py-2 px-4 font-medium focus:outline-none ${
                    selected
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`
                }>
                  Details
                </Tab>
                <Tab className={({ selected }) =>
                  `py-2 px-4 font-medium focus:outline-none ${
                    selected
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`
                }>
                  Specifications
                </Tab>
                <Tab className={({ selected }) =>
                  `py-2 px-4 font-medium focus:outline-none ${
                    selected
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`
                }>
                  Reviews ({product.ratings?.count || 0})
                </Tab>
              </TabList>
              
              <TabPanels className="mt-4">
                <TabPanel>
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                  </div>
                </TabPanel>
                
                <TabPanel>
                  {product.specifications && product.specifications.length > 0 ? (
                    <table className="w-full">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 font-medium text-gray-700">{spec.key}</td>
                            <td className="py-2 text-gray-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-600">No specifications available</p>
                  )}
                </TabPanel>
                <TabPanel>
                  <ReviewSection productId={product._id} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage