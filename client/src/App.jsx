import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import PrivateRoute from './components/PrivateRoute';
import Checkout from './pages/Checkout';
import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Navbar />
          <main style={{ flex: 1, background: '#f8fafc' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <footer style={{ background: 'white', padding: '2rem 0', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
            <div className="container">
              <p style={{ color: '#64748b' }}>&copy; 2024 SecureApp. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
