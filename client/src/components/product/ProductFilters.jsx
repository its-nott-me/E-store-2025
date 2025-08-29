import { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'

const ProductFilters = ({ filters, onFiltersChange }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys' },
  ]

  const handlePriceChange = () => {
    onFiltersChange({
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    })
  }

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' })
    onFiltersChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) => onFiltersChange({ category: e.target.value })}
                className="mr-2"
              />
              <span className="text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handlePriceChange}
          className="mt-2 w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default ProductFilters