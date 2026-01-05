import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  
  // เพิ่ม state สำหรับ role และข้อมูลธนาคาร
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'BUYER', // ค่าเริ่มต้น
    bankName: '',
    bankAccountNumber: ''
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // เตรียมข้อมูลส่ง (ถ้าไม่ใช่ Seller ไม่ต้องส่งเลขบัญชีไป)
      const payload = { ...formData };
      if (payload.role !== 'SELLER') {
        delete (payload as any).bankName;
        delete (payload as any).bankAccountNumber;
      }

      await axios.post('http://localhost:3000/users/register', payload);
      alert('✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login'); // เด้งไปหน้า Login
    } catch (error) {
      console.error(error);
      alert('❌ สมัครไม่ผ่าน: ชื่อผู้ใช้อาจซ้ำหรือระบบมีปัญหา');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>📝 สมัครสมาชิก</h1>
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

        {/* ส่วนเลือก Role */}
        <div style={{ marginBottom: '15px' }}>
          <label>สถานะ:</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="BUYER">ผู้ซื้อ (Buyer)</option>
            <option value="SELLER">ผู้ขาย (Seller)</option>
            <option value="ADMIN">ผู้ดูแลระบบ (Admin - Test)</option>
          </select>
        </div>

        {/* ส่วนข้อมูลธนาคาร (โชว์เฉพาะ Seller) */}
        {formData.role === 'SELLER' && (
          <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px dashed #ccc', marginBottom: '15px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>🏦 ข้อมูลรับเงิน (สำหรับผู้ขาย)</p>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="bankName"
                placeholder="ชื่อธนาคาร (เช่น KBANK)"
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="bankAccountNumber"
                placeholder="เลขที่บัญชี"
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
          </div>
        )}

        <button 
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ยืนยันการสมัคร
        </button>
      </form>
    </div>
  );
}

export default Register;