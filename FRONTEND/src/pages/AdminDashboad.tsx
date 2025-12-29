import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('ยืนยันการตรวจสอบสลิปเรียบร้อยใช่ไหม?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/orders/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ อนุมัติเรียบร้อย!');
      fetchAllOrders(); // โหลดข้อมูลใหม่
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>👮‍♂️ Admin Dashboard (จัดการออเดอร์)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th>ลูกค้า</th>
            <th>ยอดรวม</th>
            <th>สลิป</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #444', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>{order.id}</td>
              <td>{order.user?.username}</td>
              <td>฿{order.totalPrice}</td>
              <td>
                {order.slipImage ? (
                  <a href={`http://localhost:3000/uploads/${order.slipImage}`} target="_blank">
                    <img src={`http://localhost:3000/uploads/${order.slipImage}`} style={{ width: '50px' }} />
                  </a>
                ) : 'ไม่มีสลิป'}
              </td>
              <td style={{ color: order.status === 'APPROVED' ? '#2ecc71' : '#f1c40f' }}>
                {order.status}
              </td>
              <td>
                {order.status === 'PENDING' && (
                  <button onClick={() => handleApprove(order.id)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                    ยืนยันการจ่ายเงิน
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