import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './components/Admin/AdminPanel';
import Home from './components/Home';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Cart from './components/Cart/Cart';
import CategoryList from './components/Categories/CategoryList';
import UserManagement from './components/Admin/UserManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import ProductManagement from './components/Admin/ProductManagement';
import BannerManagement from './components/Admin/BannerManagement';
import DiscountManagement from './components/Admin/DiscountManagement';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-light">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/banners" element={<BannerManagement />} />
            <Route path="/admin/discounts" element={<DiscountManagement />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
