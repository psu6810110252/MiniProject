import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';

// กำหนดหน้าตาของข้อมูลสินค้า
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  // ฟังก์ชันดึงข้อมูล
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 🗑️ ฟังก์ชันลบสินค้า (เพิ่มใหม่)
  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบสินค้านี้ใช่ไหม?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ ลบเรียบร้อย!');
      fetchProducts(); // โหลดข้อมูลใหม่
    } catch (error) {
      alert('❌ ลบไม่ได้: กรุณาล็อกอินก่อน');
    }
  };

  // รันตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', margin: '20px 0' }}>🏠 ตลาดนัดออนไลน์</h1>
      
      {/* เมนู */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
        <Link to="/register"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>สมัครสมาชิก</button></Link>
        <Link to="/login"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>เข้าสู่ระบบ</button></Link>
        <Link to="/add-product"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px' }}>+ ลงขายของ</button></Link>
      </div>

      {/* รายการสินค้า */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: '#fff', color: '#333' }}>
            <div style={{ height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>
            
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{product.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>฿{product.price}</span>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                  {/* ปุ่มลบ (สีแดง) */}
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    ลบ
                  </button>
                  
                  {/* ปุ่มซื้อ (สีฟ้า) */}
                  <button style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    ซื้อเลย
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>ยังไม่มีสินค้า... ลองกดลงขายดูสิ!</p>}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;