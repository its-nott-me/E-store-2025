import { useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import productService from '../services/product.service'
import { setFilters, resetFilters, setSearchQuery } from '../store/productSlice'

export const useProducts = (params = {}) => {
  const { filters, searchQuery } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  const queryParams = {
    ...filters,
    ...params,
    search: searchQuery || params.search,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productService.getProducts(queryParams),
    keepPreviousData: true,
  })

  return {
    products: data?.products || [],
    totalProducts: data?.totalProducts || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    refetch,
    filters,
    searchQuery,
    setFilters: (newFilters) => dispatch(setFilters(newFilters)),
    resetFilters: () => dispatch(resetFilters()),
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  }
}

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug),
    enabled: !!slug,
  })
}

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(),
  })
}