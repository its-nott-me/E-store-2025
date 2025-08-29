import { useSelector, useDispatch } from 'react-redux'
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  toggleCart,
  openCart,
  closeCart
} from '../store/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const { cart, loading, error, isOpen } = useSelector((state) => state.cart)

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const cartTotal = cart?.total || 0

  return {
    cart,
    loading,
    error,
    isOpen,
    cartCount,
    cartTotal,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: (productId, quantity) => dispatch(addToCart({ productId, quantity })),
    updateItem: (itemId, quantity) => dispatch(updateCartItem({ itemId, quantity })),
    removeItem: (itemId) => dispatch(removeFromCart(itemId)),
    clearCart: () => dispatch(clearCart()),
    toggleCart: () => dispatch(toggleCart()),
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
  }
}