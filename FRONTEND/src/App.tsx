import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; // <--- 1. ต้อง import มา
import AddProduct from './pages/AddProduct';
// Inline AddProduct component to avoid "Cannot find module './pages/AddProduct'" error.
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🏠 ตลาดนัดออนไลน์</h1>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/register"><button>สมัครสมาชิก</button></Link>
        {/* 2. ต้องมีปุ่มนี้ */}
        <Link to="/login"><button style={{ background: 'green', color: 'white' }}>เข้าสู่ระบบ</button></Link>
        <Link to="/add-product"><button style={{ background: 'orange' }}>+ ลงขายของ</button></Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* <--- 3. ต้องมี Route นี้ */}
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;