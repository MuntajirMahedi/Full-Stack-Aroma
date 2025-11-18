import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import api from './api'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Categories from './pages/admin/Categories'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './pages/Cart'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {

  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      try {
        const res = await api.get('/api/user/me')
        setUser(res.data)
      } catch (err) {
        setUser(null)
      }
    }

    fetchProfile()

    const handler = () => fetchProfile()
    window.addEventListener('authChange', handler)
    return () => window.removeEventListener('authChange', handler)
  }, [])

  // LOAD CART COUNT
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const res = await api.get("/api/cart")
        const count = res.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setCartCount(count)
      } catch (err) {}
    }

    loadCartCount()

    // listen for cart updates
    window.addEventListener("cartChange", loadCartCount)
    return () => window.removeEventListener("cartChange", loadCartCount)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('authChange'))
    setUser(null)
    navigate('/')
  }

  return (
    <div className="app-root">
      <Header 
        user={user} 
        isAdmin={user?.isAdmin} 
        onLogout={logout}
        cartCount={cartCount}
      />

      <main className="site-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/products/:id" element={<Product/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute>{user?.isAdmin ? <Categories/> : <p>Admin access required.</p>}</ProtectedRoute>} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  )
}
