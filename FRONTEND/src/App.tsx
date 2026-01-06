import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';

import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders'; 
import SellerDashboard from './pages/SellerDashboard';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

// ✅ 1. Import Navbar เข้ามา
import Navbar from './components/Navbar';

// Component หน้าร้านค้า (Home)
function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // ❌ ไม่ต้องดึง cart มาโชว์ตัวเลขแล้ว (Navbar จัดการให้)
  const { addToCart } = useCart(); 

  useEffect(() => {
    axios.get('http://localhost:3000/products').then((res) => {
      setProducts(res.data);
    });
  }, []);

  // ❌ ลบ handleLogout ออก (Navbar จัดการให้)

  // กรองสินค้าตามคำค้นหา
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#333' }}>
      
      {/* ❌ ลบ Header/ปุ่มเดิมออก เพราะมี Navbar แล้ว */}

      {/* Search Bar (ปรับ margin ด้านบนเพิ่มนิดหน่อย) */}
      <div style={{ marginTop: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
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
          {/* ✅ 2. ใส่ Navbar ไว้ตรงนี้ (เพื่อให้แสดงผลทุกหน้า) */}
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Buyer Routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            
            {/* Seller Routes */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            
            {/* ถ้ายังต้องการเข้าผ่าน /my-products ก็ให้ชี้ไปที่ Dashboard */}
            <Route path="/my-products" element={<SellerDashboard />} />

            {/* Seller Forms */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}