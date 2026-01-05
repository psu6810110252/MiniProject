import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);

      const token = response.data.access_token || response.data.token;
      const user = response.data.user; // Backend ส่งมาเช่น { role: 'SELLER', ... }

      if (!token) throw new Error("ไม่พบ Token");

      // 🛠️ 1. ปรับ Role ให้เป็นตัวพิมพ์เล็ก และแปลง BUYER -> user เพื่อให้ตรงกับ App.tsx
      let role = user?.role ? user.role.toLowerCase() : 'user';
      if (role === 'buyer') role = 'user'; // แมพ BUYER ให้เป็น user

      const safeUser = { ...user, role }; // อัปเดต role ที่แปลงแล้วกลับเข้าไป

      // บันทึกลง Storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', safeUser.role);

      // อัปเดต Context
      if (login) {
        login(safeUser, token);
      }

      alert(`✅ ยินดีต้อนรับคุณ ${safeUser.username} (${safeUser.role})`);

      // 🚀 2. Redirect ให้ตรงกับ Route ที่มีใน App.tsx
      if (safeUser.role === 'admin') {
        navigate('/admin');
      } else if (safeUser.role === 'seller') {
        navigate('/seller-dashboard'); // 👈 แก้ตรงนี้จาก /seller เป็น /seller-dashboard
      } else {
        navigate('/'); // user (buyer) ไปหน้าแรก
      }

    } catch (error: any) {
      console.error("❌ Login Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
      <h1 style={{ textAlign: 'center' }}>🔐 เข้าสู่ระบบ</h1>
      
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        
        {errorMessage && (
          <div style={{ backgroundColor: '#ffdede', color: 'red', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {isLoading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}

export default Login;