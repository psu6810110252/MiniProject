import { useState } from 'react';
import axios from 'axios';

function Register() {
  // State สำหรับเก็บค่าจากฟอร์ม
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // ฟังก์ชันคอยอัปเดต State เวลาพิมพ์
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ฟังก์ชันเมื่อกดปุ่ม "สมัครสมาชิก"
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // ห้ามรีเฟรชหน้าจอ
    try {
      // ยิง API ไปหา Backend
      const response = await axios.post('http://localhost:3000/users/register', formData);
      alert('✅ สมัครสมาชิกสำเร็จ! (ID: ' + response.data.id + ')');
    } catch (error) {
      console.error(error);
      alert('❌ สมัครไม่ผ่าน: ชื่ออาจซ้ำหรือระบบมีปัญหา');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>📝 สมัครสมาชิกใหม่</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
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
          style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          ยืนยันการสมัคร
        </button>
      </form>
    </div>
  );
}

export default Register;