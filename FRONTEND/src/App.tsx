import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';

// สร้างหน้า Home ชั่วคราว (เดี๋ยวค่อยทำสวยๆ)
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🏠 หน้าหลัก</h1>
      <p>ยินดีต้อนรับสู่ร้านค้าของเรา</p>
      <Link to="/register">👉 ไปหน้าสมัครสมาชิก</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก (/) ให้แสดง Home */}
        <Route path="/" element={<Home />} />
        
        {/* หน้าสมัครสมาชิก (/register) ให้แสดง Register */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;