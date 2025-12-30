import { useState, useEffect } from 'react';
import axios from 'axios';

interface Payout {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  order: {
    id: number;
  };
}

function SellerDashboard() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      // API นี้ต้องไปสร้างเพิ่มใน Backend เพื่อดึงข้อมูล Payout ของผู้ขายที่ Login อยู่
      const res = await axios.get('http://localhost:3000/orders/payouts/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayouts(res.data);
    } catch (err) {
      console.error("Error fetching payouts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayouts(); }, []);

  const totalPending = payouts
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>💰 แผงควบคุมผู้ขาย (Seller Dashboard)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#28a745', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>ยอดเงินรอโอนทั้งหมด</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>฿{totalPending.toLocaleString()}</p>
        </div>
        <div style={{ background: '#17a2b8', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>รายการขายทั้งหมด</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{payouts.length} รายการ</p>
        </div>
      </div>

      <h2>📜 รายการรายได้</h2>
      {loading ? <p>กำลังโหลด...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: '12px' }}>วันที่</th>
              <th>Order ID</th>
              <th>จำนวนเงิน</th>
              <th>สถานะการโอน</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(payout => (
              <tr key={payout.id} style={{ borderBottom: '1px solid #444', textAlign: 'center' }}>
                <td style={{ padding: '12px' }}>{new Date(payout.createdAt).toLocaleDateString()}</td>
                <td>#{payout.order?.id}</td>
                <td>฿{Number(payout.amount).toLocaleString()}</td>
                <td style={{ color: payout.status === 'PAID' ? '#2ecc71' : '#f1c40f' }}>
                  {payout.status === 'PENDING' ? '⏳ รอแอดมินโอนเงิน' : '✅ โอนเงินแล้ว'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SellerDashboard;