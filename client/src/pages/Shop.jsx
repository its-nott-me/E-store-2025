import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductList from '../components/product/ProductList'
import ProductFilters from '../components/product/ProductFilters'
import { ChevronDownIcon } from '@heroicons/react/outline'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const params = {
    page: searchParams.get('page') || 1,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  }

  const { products, totalProducts, totalPages, currentPage, isLoading, setFilters } = useProducts(params)

  const handleSortChange = (sort) => {
    setSearchParams({ ...params, sort })
  }

  const handlePageChange = (page) => {
    setSearchParams({ ...params, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Shop</h1>
          <p className="text-gray-600">
            {totalProducts} products found
            {params.search && ` for "${params.search}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters 
              filters={params}
              onFiltersChange={(newFilters) => setSearchParams({ ...params, ...newFilters, page: 1 })}
            />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 text-gray-700"
              >
                <span>Filters</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Sort by:</label>
                <select
                  value={params.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <ProductList products={products} loading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop