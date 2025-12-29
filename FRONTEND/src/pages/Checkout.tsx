import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [slip, setSlip] = useState<File | null>(null);

  const handlePayment = async () => {
    if (!slip) return alert("กรุณาแนบสลิปครับ");
    
    const formData = new FormData();
    // ส่งรายการสินค้าทั้งหมดในตะกร้าเป็น JSON string
    formData.append('items', JSON.stringify(cart)); 
    formData.append('file', slip);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/orders/bulk', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("✅ ชำระเงินเรียบร้อย รอแอดมินตรวจสอบครับ");
      clearCart(); // ล้างตะกร้าหลังซื้อเสร็จ
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>💸 ยอดชำระรวม: ฿{totalPrice}</h1>
      {/* ส่วนแสดง QR Code และที่อัปโหลดไฟล์เหมือนเดิม */}
      <input type="file" onChange={(e) => setSlip(e.target.files?.[0] || null)} />
      <button onClick={handlePayment}>ยืนยันการชำระเงิน</button>
    </div>
  );
}