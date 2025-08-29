import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import userService from '../services/user.service'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useFeaturedProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import Loader from '../components/common/Loader'

const Home = () => {
  const { data, isLoading } = useFeaturedProducts()
  const featuredProducts = data?.products || []
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      title: 'New Collection',
      subtitle: 'Discover the latest trends',
      cta: 'Shop Now',
      link: '/shop?sort=newest'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off selected items',
      cta: 'Shop Sale',
      link: '/shop?sale=true'
    }
  ]

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661', link: '/shop?category=electronics' },
    { name: 'Clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f', link: '/shop?category=clothing' },
    { name: 'Home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a', link: '/shop?category=home' },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', link: '/shop?category=beauty' },
  ]

  const handleSubscribeNewsletter = async (event) => {
    event.preventDefault();
    try {
      setLoading(true)
      await userService.subscribeNewsletter(email)
      setEmail('')
      toast.success('Thank you for subscribing')
    } catch (error) {
      toast.error('Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <img
                  crossOrigin='anonymous'
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-white"
                  >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                    <Link
                      to={slide.link}
                      className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={category.link} className="block relative group">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      crossOrigin='anonymous'
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {isLoading ? (
            <Loader size="large" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-8">Get the latest updates on new products and upcoming sales</p>
          <form onSubmit={handleSubscribeNewsletter} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {loading ? (
                'Subscribing...'
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home