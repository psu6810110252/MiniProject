import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

// ... (Interface และ Header เหมือนเดิม) ...
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
}

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('ออกจากระบบเรียบร้อย 👋');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
      {!isLoggedIn ? (
        <>
          <Link to="/register"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>สมัครสมาชิก</button></Link>
          <Link to="/login"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>เข้าสู่ระบบ</button></Link>
        </>
      ) : (
        <>
          <Link to="/add-product"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px' }}>+ ลงขายของ</button></Link>
          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>ออกจากระบบ</button>
        </>
      )}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔥 1. state สำหรับจัดการ Modal จ่ายเงิน
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      alert('❌ ลบไม่ได้: กรุณาล็อกอินก่อน');
    }
  };

  // 🔥 2. ฟังก์ชันกดปุ่มซื้อ
  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setShowPayment(true); // เปิด Modal
  };

  // 🔥 3. ฟังก์ชันยืนยันการจ่าย
  const handleConfirmPayment = () => {
    alert(`💰 ขอบคุณที่ชำระเงินค่า "${selectedProduct?.title}" \nเราจะจัดส่งให้ทันที!`);
    setShowPayment(false); // ปิด Modal
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', margin: '20px 0' }}>🏠 ตลาดนัดออนไลน์</h1>
      <Header />

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
          type="text" placeholder="🔍 พิมพ์ชื่อสินค้าเพื่อค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '15px', width: '80%', maxWidth: '500px', borderRadius: '25px', border: '1px solid #ccc', fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: '#fff', color: '#333' }}>
            <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {(product as any).image ? (
                <img src={`http://localhost:3000/uploads/${(product as any).image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <Link to={`/edit/${product.id}`}><button style={{ padding: '5px 10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>แก้ไข</button></Link>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ลบ</button>
                  
                  {/* 👇 แก้ปุ่มซื้อให้เรียกฟังก์ชัน handleBuy */}
                  <button onClick={() => handleBuy(product)} style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ซื้อเลย</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 4. ส่วนแสดง Popup Payment (Modal) */}
      {showPayment && selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', textAlign: 'center', color: '#333' }}>
            <h2>🛒 ชำระเงิน</h2>
            <p>สินค้า: <strong>{selectedProduct.title}</strong></p>
            <h1 style={{ color: '#28a745' }}>฿{selectedProduct.price}</h1>
            
            <div style={{ margin: '20px 0', padding: '10px', border: '2px dashed #ccc', borderRadius: '10px' }}>
              <p style={{ marginBottom: '10px' }}>สแกน QR Code เพื่อจ่ายเงิน</p>
              {/* รูป QR Code จากโฟลเดอร์ public */}
              <img src="/qr-code.jpg" alt="QR Code" style={{ width: '200px', height: '200px', objectFit: 'contain' }} 
                   onError={(e) => (e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')} 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setShowPayment(false)} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={handleConfirmPayment} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>✅ แจ้งชำระเงิน</button>
            </div>
          </div>
        </div>
      )}

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
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );

  function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับ Modal จ่ายเงิน
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // 📸 เพิ่มตัวแปรเก็บรูปสลิป
  const [slipImage, setSlipImage] = useState<File | null>(null);

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
      alert('❌ ลบไม่ได้: กรุณาล็อกอินก่อน');
    }
  };

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setSlipImage(null); // ล้างสลิปเก่าทิ้งก่อนเปิด
    setShowPayment(true);
  };

  // ฟังก์ชันรับรูปสลิป
  const handleSlipChange = (e: any) => {
    setSlipImage(e.target.files[0]);
  };

  // ฟังก์ชันกดแจ้งโอน (แบบ Basic)
  const handleConfirmPayment = () => {
    if (!slipImage) {
      alert('⚠️ กรุณาแนบสลิปโอนเงินก่อนครับ!');
      return;
    }

    // ในของจริงเราจะส่ง slipImage ไปที่ Backend ตรงนี้
    // แต่ตอนนี้เราทำ Mock Simulation ให้เห็นภาพก่อน
    alert(`✅ ได้รับสลิปแล้ว!\nสินค้า: ${selectedProduct?.title}\nเราจะตรวจสอบและจัดส่งให้เร็วที่สุดครับ`);
    
    setShowPayment(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', margin: '20px 0' }}>🏠 ตลาดนัดออนไลน์</h1>
      <Header />

      {/* ช่องค้นหา */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
          type="text" placeholder="🔍 พิมพ์ชื่อสินค้าเพื่อค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '15px', width: '80%', maxWidth: '500px', borderRadius: '25px', border: '1px solid #ccc', fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', outline: 'none' }}
        />
      </div>

      {/* รายการสินค้า */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: '#fff', color: '#333' }}>
            <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {(product as any).image ? (
                <img src={`http://localhost:3000/uploads/${(product as any).image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <Link to={`/edit/${product.id}`}><button style={{ padding: '5px 10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>แก้ไข</button></Link>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ลบ</button>
                  <button onClick={() => handleBuy(product)} style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ซื้อเลย</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Modal จ่ายเงิน + แนบสลิป */}
      {showPayment && selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', textAlign: 'center', color: '#333' }}>
            <h2>🛒 แจ้งชำระเงิน</h2>
            <p>สินค้า: <strong>{selectedProduct.title}</strong></p>
            <h1 style={{ color: '#28a745', margin: '10px 0' }}>฿{selectedProduct.price}</h1>
            
            {/* โซน QR Code */}
            <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee', borderRadius: '10px', background: '#f9f9f9' }}>
              <p style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>1. สแกน QR Code เพื่อโอนเงิน</p>
              <img src="/qr-code.jpg" alt="QR Code" style={{ width: '150px', height: '150px', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                   onError={(e) => (e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')} 
              />
            </div>

            {/* โซนแนบสลิป */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>2. แนบหลักฐานการโอนเงิน (สลิป)</p>
              <input type="file" accept="image/*" onChange={handleSlipChange} style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setShowPayment(false)} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ยกเลิก</button>
              
              {/* ปุ่มยืนยัน (เช็คก่อนว่ามีรูปไหม) */}
              <button onClick={handleConfirmPayment} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                 ✅ ส่งหลักฐาน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
}

export default App;