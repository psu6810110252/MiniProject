import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboad';
import CartPage from './pages/CartPage';
import SellerDashboard from './pages/SellerDashboard';

// Contexts
import { useCart, CartProvider } from './context/CartContext'; 
import { useAuth, AuthProvider } from './context/AuthContext';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
}

// ✅ 1. AdminRoute: แก้เป็น 'ADMIN' (ตัวใหญ่)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  if (!token || role !== 'ADMIN') { 
    return <Navigate to="/" replace />;
  }
  return children;
};

// ✅ 2. Header: แก้ Role เป็นตัวใหญ่หมด ('ADMIN', 'SELLER', 'BUYER')
function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const { cart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    alert('ออกจากระบบเรียบร้อย 👋');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      {!isLoggedIn ? (
        <>
          <Link to="/register"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>สมัครสมาชิก</button></Link>
          <Link to="/login"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>เข้าสู่ระบบ</button></Link>
        </>
      ) : (
        <>
          {/* 🔴 ADMIN */}
          {user?.role === 'ADMIN' && (
            <Link to="/admin">
              <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#d33', color: 'white', border: 'none', borderRadius: '5px' }}>
                🛡️ จัดการสลิป (Admin)
              </button>
            </Link>
          )}

          {/* 🟠 SELLER */}
          {user?.role === 'SELLER' && (
            <>
              <Link to="/add-product">
                <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px' }}>
                  + ลงขายของ
                </button>
              </Link>
              <Link to="/seller-dashboard" style={{ marginLeft: '10px' }}>
                <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                  💰 ยอดขาย
                </button>
              </Link>
            </>
          )}

          {/* 🔵 BUYER: รองรับทั้ง 'BUYER' และ 'user' (เผื่อเคสเก่า) */}
          {(user?.role === 'BUYER' || user?.role === 'user') && (
            <>
              <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', marginLeft: '10px' }}>
                <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px' }}>
                  🛒 ตะกร้า ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              </Link>

              <Link to="/my-orders">
                <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '10px' }}>
                  📜 ประวัติการสั่งซื้อ
                </button>
              </Link>
            </>
          )}

          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '10px' }}>ออกจากระบบ</button>
        </>
      )}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth(); 

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบสินค้านี้ใช่ไหม?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ ลบเรียบร้อย!');
      fetchProducts();
    } catch (error) {
      alert('❌ ลบไม่ได้: คุณไม่มีสิทธิ์');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', margin: '20px 0' }}>🏠 Lecture Clubhouse 🩷</h1>
      <Header />

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
          type="text" placeholder="🔍 ค้นหาสินค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '15px', width: '80%', maxWidth: '500px', borderRadius: '25px', border: '1px solid #ccc', fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: '#fff' }}>
            <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.image ? (
                <img src={`http://localhost:3000/uploads/${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '3rem' }}>📦</span>
              )}
            </div>
            
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{product.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>฿{product.price}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  
                  {/* แก้ไขเงื่อนไข Role ให้เป็นตัวใหญ่ */}
                  {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
                    <>
                        <Link to={`/edit/${product.id}`}><button style={{ padding: '5px 10px', background: '#ec12f3ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>แก้ไข</button></Link>
                        <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ลบ</button>
                    </>
                  )}
                  
                  {(user?.role === 'BUYER' || user?.role === 'user') && (
                    <button 
                      onClick={() => addToCart(product)} 
                      style={{ padding: '5px 10px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      🛒 ใส่ตะกร้า
                    </button>
                  )}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;