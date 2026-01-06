import { useState } from 'react';
import { useCart } from '../context/CartContext'; // ตรวจสอบว่า path ถูกต้อง
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const { cart, clearCart } = useCart(); // ดึงข้อมูลจาก CartContext
  // คำนวณยอดรวม (ถ้าใน Context มี total ให้ใช้อันนั้น แต่ถ้าไม่มีให้คำนวณใหม่แบบนี้ถูกต้องแล้วครับ)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('ตะกร้าว่างเปล่า!');
    if (!file) return alert('กรุณาแนบสลิปโอนเงิน');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // ส่งข้อมูลรายการสินค้า (แปลงเป็น JSON string)
      formData.append('items', JSON.stringify(cart));
      // ส่งไฟล์สลิป
      formData.append('file', file);

      // ✅ แก้ไขตรงนี้: เปลี่ยน URL เป็น /orders/bulk เพื่อให้ Backend รู้ว่าเป็นตะกร้าสินค้า
      await axios.post('http://localhost:3000/orders/bulk', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ สั่งซื้อสำเร็จ! กรุณารอแอดมินตรวจสอบ');
      clearCart(); // ล้างตะกร้า
      navigate('/my-orders'); // เด้งไปหน้าประวัติการสั่งซื้อ
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🛒 ชำระเงิน (Checkout)</h1>
      
      {/* รายการสินค้าสรุป */}
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>สรุปรายการสินค้า</h3>
        {cart.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', padding: '8px 0' }}>
            <span>{item.title} x {item.quantity}</span>
            <span>฿{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'right' }}>
          ยอดรวมทั้งสิ้น: <span style={{ color: '#28a745' }}>฿{total.toLocaleString()}</span>
        </div>
      </div>

      {/* ส่วนโอนเงิน */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>💳 ช่องทางการโอนเงิน</h3>
        <p>ธนาคาร: <b>KBANK (กสิกรไทย)</b></p>
        <p>เลขบัญชี: <b>123-4-56789-0</b></p>
        <p>ชื่อบัญชี: <b>บริษัท MiniProject จำกัด</b></p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>แนบหลักฐานการโอนเงิน (สลิป):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button 
        onClick={handleCheckout}
        style={{ width: '100%', padding: '15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        ยืนยันการสั่งซื้อ 🚀
      </button>
    </div>
  );
}