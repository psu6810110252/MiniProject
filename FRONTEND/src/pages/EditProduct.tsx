import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // useParams ช่วยดึง ID จาก URL

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง id จากลิงก์ (เช่น /edit/5 -> ได้เลข 5)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
  });

  // 1. ดึงข้อมูลเก่ามาโชว์ก่อน
  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setFormData(response.data);
      } catch (error) {
        alert('หาข้อมูลสินค้าไม่เจอ');
      }
    };
    fetchOldData();
  }, [id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. บันทึกข้อมูลใหม่
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, price: +formData.price }; // แปลงราคาเป็นตัวเลข

      // ใช้ axios.patch เพื่อแก้ไข
      await axios.patch(`http://localhost:3000/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ แก้ไขเรียบร้อย!');
      navigate('/'); // กลับหน้าแรก
    } catch (error) {
      console.error(error);
      alert('❌ แก้ไขไม่ได้: มีข้อผิดพลาด');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '50px', color: 'white' }}>
      <h1>✏️ แก้ไขสินค้า</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>ชื่อสินค้า:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>รายละเอียด:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>ราคา (บาท):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#e67e22', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}

export default EditProduct;