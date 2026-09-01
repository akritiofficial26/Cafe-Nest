import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ROLES } from './services/auth.service'
import RequireAuth from './components/auth/RequireAuth'
import SiteLayout from './components/layout/SiteLayout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import TasteMatch from './pages/TasteMatch'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Feedback from './pages/Feedback'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

/**
 * The site is login-gated. Only three things are reachable while signed out:
 * the Home landing page, the login screen, and the 404 — everything else
 * bounces to /login and comes back after signing in.
 *
 * Three route groups:
 *   /login  — standalone, no site chrome
 *   site    — Navbar + Footer; Home public, the rest behind RequireAuth
 *   /admin  — standalone, admins only
 */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Login — full screen, outside the site chrome. */}
          <Route path="/login" element={<Login />} />

          {/* Café site. */}
          <Route element={<SiteLayout />}>
            {/* The only public page: a landing screen for visitors without an
                account. Its product cards route to login on Add. */}
            <Route path="/" element={<Home />} />

            {/* Everything below needs a session. */}
            <Route element={<RequireAuth />}>
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/taste-match" element={<TasteMatch />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            </Route>

            {/* Left public on purpose: a 404 behind a login wall tells a
                visitor nothing and reads as a broken site. */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin — signed-in admins only, no site chrome. */}
          <Route element={<RequireAuth role={ROLES.admin} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
