import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      
      const payload = {
        ...formData,
        price: +formData.price, 
      };
      // ส่งข้อมูลไป Backend พร้อมแนบ Token ไปใน Header
      await axios.post('http://localhost:3000/products', payload, {
        headers: { Authorization: `Bearer ${token}` } 
      });

      alert('✅ ลงขายสินค้าเรียบร้อย!');
      navigate('/'); // กลับหน้าแรก
    } catch (error) {
      console.error(error);
      alert('❌ ลงขายไม่ได้: กรุณาล็อกอินก่อน หรือเซิฟเวอร์มีปัญหา');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
      <h1>📦 ลงขายสินค้า</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>ชื่อสินค้า:</label>
          <input type="text" name="title" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>รายละเอียด:</label>
          <textarea name="description" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>ราคา (บาท):</label>
          <input type="number" name="price" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', background: 'orange', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>
          + ลงขายทันที
        </button>
      </form>
    </div>
  );
}

export default AddProduct;