import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import MyProducts from './pages/SellerDashboard'; 
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders'; 
import SellerDashboard from './pages/SellerDashboard';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

// ✅ 1. Import ไฟล์ AdminDashboard ของจริงเข้ามา
import AdminDashboard from './pages/AdminDashboard';

// ❌ (ลบโค้ด Placeholder เดิมออกแล้ว เพราะเราใช้ไฟล์จริงแล้ว)

// Component หน้าร้านค้า (Home)
function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/products').then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // กรองสินค้าตามคำค้นหา
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#333' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '3rem', margin: '10px 0', color: '#f0f0f0' }}>
          🏠 Lecture Clubhouse 💗
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <Link to="/checkout">
            <button style={{ padding: '10px 20px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              🛒 ตะกร้า ({cart.length})
            </button>
          </Link>
          <Link to="/my-orders">
            <button style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              📜 ประวัติการสั่งซื้อ
            </button>
          </Link>
          <button 
            onClick={handleLogout}
            style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหาสินค้า..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '500px', padding: '12px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', fontSize: '1rem' }}
        />
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
            
            {/* รูปภาพสินค้า */}
            <div style={{ height: '180px', overflow: 'hidden', background: '#eee' }}>
              <img 
                src={`http://localhost:3000/uploads/${product.image}`} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div style={{ padding: '15px' }}>
              
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>
                {product.title}
              </h3>

              <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {product.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                  ฿{product.price}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  style={{ padding: '8px 15px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🛒 ใส่ตะกร้า
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

// Main App Component with Routes
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Buyer Routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            
            {/* Seller Routes */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/add-product" element={<MyProducts />} />
            <Route path="/edit/:id" element={<MyProducts />} />

            {/* Admin Routes */}
            {/* ✅ เรียกใช้ AdminDashboard ที่ import มา */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}