import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLogin from './admin/pages/Login';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminInventory from './admin/pages/Inventory';
import AdminOrders from './admin/pages/Orders';
import AdminBilling from './admin/pages/Billing';
import AdminCustomers from './admin/pages/Customers';
import AdminCustomerDetails from './admin/pages/CustomerDetails';
import AdminSettings from './admin/pages/Settings';
import AdminAddProduct from './admin/pages/AddProduct';
import AdminCategories from './admin/pages/Categories';
import AdminOrderDetails from './admin/pages/OrderDetails';
import AdminReports from './admin/pages/Reports';
import AdminExpenses from './admin/pages/Expenses';
import AdminGalleryManagement from './admin/pages/GalleryManagement';
import AdminHistory from './admin/pages/History';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <StoreSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Public Customer Facing Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="products" element={<Products />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="checkout" element={<Checkout />} />
                </Route>
                
                {/* Admin Authentication Login Route (Public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes (Firebase Auth Guarded) */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<AdminAddProduct />} />
                    <Route path="products/edit/:id" element={<AdminAddProduct />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="history" element={<AdminHistory />} />
                    <Route path="orders/:id" element={<AdminOrderDetails />} />
                    <Route path="billing" element={<AdminBilling />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="expenses" element={<AdminExpenses />} />
                    <Route path="gallery" element={<AdminGalleryManagement />} />
                    <Route path="website" element={<AdminGalleryManagement />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="customers/:id" element={<AdminCustomerDetails />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </ToastProvider>
  );
}

export default App;
