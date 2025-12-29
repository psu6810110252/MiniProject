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
  const [file, setFile] = useState<File | null>(null); // <--- 1. เพิ่มตัวเก็บไฟล์

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. ฟังก์ชันเมื่อเลือกไฟล์รูป
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // 3. เปลี่ยนวิธีแพ็คของเป็น FormData (สำคัญมาก!)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', String(formData.price)); // FormData รับแต่ String
      if (file) {
        data.append('file', file); // 'file' ต้องตรงกับที่ Backend รอรับ
      }

      // ส่ง FormData ไปแทน JSON
      await axios.post('http://localhost:3000/products', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // บอกว่าเป็นไฟล์นะ
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px', color: 'white' }}>
      <h1>📦 ลงขายสินค้า (มีรูป)</h1>
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
        
        {/* 4. เพิ่มช่องเลือกรูปภาพ */}
        <div style={{ marginBottom: '20px' }}>
          <label>รูปภาพสินค้า:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '5px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', background: 'orange', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>
          + ลงขายทันที
        </button>
      </form>
    </div>
  );
}

export default AddProduct;