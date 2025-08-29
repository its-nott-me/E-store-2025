import { Outlet } from 'react-router-dom'
import Header from '../common/Header'
import Footer from '../common/Footer'
import CartDrawer from '../cart/CartDrawer'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default MainLayout