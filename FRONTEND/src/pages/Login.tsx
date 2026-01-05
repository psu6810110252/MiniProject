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

      console.log("📌 Server Response:", response.data);

      const token = response.data.access_token || response.data.token;
      const user = response.data.user;

      if (!token) {
        throw new Error("ไม่พบ Token ในการตอบกลับจาก Server");
      }
      
      const safeUser = user ? { ...user } : { id: 0, username: formData.username, role: 'user' };
      if (!safeUser.role) safeUser.role = 'user';

      localStorage.setItem('token', token);
      localStorage.setItem('role', safeUser.role);

      if (login) {
        login(safeUser, token);
      }

      alert(`✅ ยินดีต้อนรับคุณ ${safeUser.username}`);
      navigate('/'); 

    } catch (error: any) {
      console.error("❌ Login Error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        } else if (error.response.status === 404) {
          setErrorMessage('ไม่พบ Server หรือ URL ผิดพลาด (404)');
        } else {
          setErrorMessage(`เกิดข้อผิดพลาด: ${error.response.data.message || 'Unknown Error'}`);
        }
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อ Server ได้ (ตรวจสอบว่าเปิด Backend หรือยัง)');
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
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: isLoading ? '#ccc' : '#28a745',
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontSize: '16px', 
            fontWeight: 'bold' 
          }}
        >
          {isLoading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}

export default Login;