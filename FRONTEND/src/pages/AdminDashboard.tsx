import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  slipImage: string;
  user: { username: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลออเดอร์ทั้งหมด
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      // ตรวจสอบ Endpoint ให้ตรงกับ Backend ของคุณ
      const res = await axios.get('http://localhost:3000/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('คุณอาจไม่ใช่ Admin หรือ Token หมดอายุ');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ฟังก์ชันกดอนุมัติ
  const handleApprove = async (id: number) => {
    if(!confirm("ตรวจสอบสลิปแล้ว ยืนยันการอนุมัติใช่ไหม?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/orders/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ อนุมัติเรียบร้อย!');
      fetchOrders(); // โหลดข้อมูลใหม่ทันทีหลังอนุมัติ
    } catch (err) {
      console.error(err);
      alert('❌ เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#f0f0f0' }}>👮‍♂️ Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ออกจากระบบ
        </button>
      </div>
      
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', padding: '20px' }}>
        <h2 style={{marginTop: 0}}>รายการสั่งซื้อรอตรวจสอบ</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: 10 }}>ID</th>
              <th>ผู้ซื้อ</th>
              <th>ยอดเงิน</th>
              <th>สลิป</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr><td colSpan={6} style={{padding: '20px', textAlign: 'center'}}>ไม่มีออเดอร์</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                <td style={{ padding: 10 }}>#{order.id}</td>
                <td>{order.user?.username || 'Unknown'}</td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>฿{order.totalPrice.toLocaleString()}</td>
                <td>
                  {order.slipImage ? (
                    <a href={`http://localhost:3000/uploads/${order.slipImage}`} target="_blank" rel="noreferrer">
                      <img 
                        src={`http://localhost:3000/uploads/${order.slipImage}`} 
                        alt="Slip" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #ccc', cursor: 'pointer' }}
                      />
                    </a>
                  ) : <span style={{color:'red'}}>ไม่มี</span>}
                </td>
                <td>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    background: order.status === 'APPROVED' ? '#d4edda' : '#fff3cd', 
                    color: order.status === 'APPROVED' ? 'green' : (order.status === 'PENDING' ? 'orange' : 'gray'),
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'PENDING' && (
                    <button onClick={() => handleApprove(order.id)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                      อนุมัติ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}