import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string; // 'pending' | 'paid' | 'shipped'
  slipImage?: string; // ชื่อไฟล์รูปสลิป
}

function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // 1. ดึงข้อมูล Order ทั้งหมด
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // สมมติ API นี้ดึงรายการทั้งหมด (ต้องแก้ Backend ให้รองรับถ้ายังไม่มี)
      const response = await axios.get('http://localhost:3000/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. ฟังก์ชันอนุมัติสลิป (เปลี่ยน status เป็น paid)
  const handleApprove = async (orderId: number) => {
    if (!confirm('ยืนยันว่าสลิปถูกต้อง และต้องการอนุมัติ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/orders/${orderId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ อนุมัติสำเร็จ!');
      fetchOrders(); // รีเฟรชตาราง
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🛡️ Admin Dashboard (ตรวจสอบสลิป)</h1>
      <button onClick={() => navigate('/')}>🏠 กลับหน้าหลัก</button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '10px' }}>Order ID</th>
            <th style={{ padding: '10px' }}>ยอดเงิน</th>
            <th style={{ padding: '10px' }}>หลักฐาน (สลิป)</th>
            <th style={{ padding: '10px' }}>สถานะ</th>
            <th style={{ padding: '10px' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>#{order.id}</td>
              <td style={{ padding: '10px' }}>฿{order.totalPrice}</td>
              <td style={{ padding: '10px' }}>
                {order.slipImage ? (
                  <a href={`http://localhost:3000/uploads/${order.slipImage}`} target="_blank" rel="noreferrer">
                    <img src={`http://localhost:3000/uploads/${order.slipImage}`} alt="Slip" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  </a>
                ) : <span style={{ color: 'gray' }}>ไม่มีสลิป</span>}
              </td>
              <td style={{ padding: '10px', color: order.status === 'paid' ? 'green' : 'orange' }}>
                {order.status.toUpperCase()}
              </td>
              <td style={{ padding: '10px' }}>
                {order.status === 'pending' && order.slipImage && (
                  <button 
                    onClick={() => handleApprove(order.id)}
                    style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    ✅ อนุมัติ
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;