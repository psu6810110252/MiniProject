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
    if (!file) {
      alert('⚠️ กรุณาอัปโหลดรูปปก Lecture ด้วยครับ');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('file', file); // ส่งไฟล์ไปที่ Backend

      await axios.post('http://localhost:3000/products', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      });

      alert('✅ ลงขาย Lecture เรียบร้อย!');
      navigate('/seller-dashboard'); // ลงเสร็จให้เด้งไปหน้า Dashboard
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาด: กรุณาล็อกอินใหม่');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '40px auto', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📚 ลงขาย Lecture ใหม่</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>ชื่อวิชา / หัวข้อ:</label>
          <input type="text" name="title" onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>รายละเอียด:</label>
          <textarea name="description" rows={4} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>ราคา (บาท):</label>
          <input type="number" name="price" onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px dashed #ccc' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>📸 รูปปก Lecture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          {file && <p style={{ fontSize: '0.8rem', color: 'green', marginTop: '5px' }}>ไฟล์ที่เลือก: {file.name}</p>}
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          + ยืนยันการลงขาย
        </button>
      </form>
    </div>
  );
}

export default AddProduct;