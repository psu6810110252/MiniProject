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
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      if (file) {
        data.append('file', file);
      }

      await axios.post('http://localhost:3000/products', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      });

      alert('✅ ลงขายพร้อมรูปเรียบร้อย!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('❌ ลงขายไม่ได้: กรุณาล็อกอินก่อน หรือเซิฟเวอร์มีปัญหา');
    }
  };

  return (
    // 🚩 แก้ไข: เอา color: 'white' ออก และใส่สีดำแทนเพื่อให้เห็นชัดบนพื้นขาว
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', color: '#333', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center' }}>📦 ลงขายสินค้า</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อสินค้า:</label>
          <input type="text" name="title" onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รายละเอียด:</label>
          <textarea name="description" onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ราคา (บาท):</label>
          <input type="number" name="price" onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รูปภาพสินค้า:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '5px' }} />
        </div>

        <button type="submit" style={{ padding: '12px', background: '#ff9800', color: 'white', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' }}>
          + ลงขายทันที
        </button>
      </form>
    </div>
  );
}

export default AddProduct;