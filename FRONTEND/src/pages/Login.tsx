import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ตัวช่วยเปลี่ยนหน้า

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // 1. ส่ง Username/Password ไปตรวจสอบที่ /auth/login
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      
      // 2. ถ้าผ่าน จะได้ Token กลับมา ให้เก็บไว้ในเครื่อง (Local Storage)
      localStorage.setItem('token', response.data.access_token);
      
      alert('✅ ล็อกอินสำเร็จ! ยินดีต้อนรับครับ');
      
      // 3. ดีดไปหน้าแรก (Home)
      navigate('/'); 
      
    } catch (error) {
      console.error(error);
      alert('❌ ล็อกอินไม่ผ่าน: ชื่อหรือรหัสผ่านผิด');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
      <h1>🔐 เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            required 
          />
        </div>
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default Login;