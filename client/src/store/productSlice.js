import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    filters: {
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      sort: 'newest',
    },
    searchQuery: '',
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        sort: 'newest',
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setFilters, resetFilters, setSearchQuery } = productSlice.actions
export default productSlice.reducer