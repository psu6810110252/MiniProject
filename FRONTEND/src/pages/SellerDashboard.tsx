import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // 1. เพิ่ม useNavigate

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface Payout {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  order: { id: number; };
}

function SellerDashboard() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับบัญชีธนาคาร
  const [bankInfo, setBankInfo] = useState({ bankName: '', bankAccountNumber: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);

  const navigate = useNavigate(); // 2. ประกาศตัวแปร navigate
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // 1. โหลดข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPayouts = await axios.get('http://localhost:3000/orders/payouts/my', authHeader);
        setPayouts(resPayouts.data);

        const resProfile = await axios.get('http://localhost:3000/users/profile', authHeader);
        setBankInfo({
          bankName: resProfile.data.bankName || '',
          bankAccountNumber: resProfile.data.bankAccountNumber || ''
        });

        const resProducts = await axios.get('http://localhost:3000/products/my-products', authHeader);
        setMyProducts(resProducts.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        // ถ้า Token หมดอายุ เด้งไป Login
        // navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. ฟังก์ชันบันทึกเลขบัญชี
  const handleSaveBank = async () => {
    try {
      await axios.patch('http://localhost:3000/users/bank-info', bankInfo, authHeader);
      alert('✅ บันทึกข้อมูลธนาคารเรียบร้อย');
      setIsEditingBank(false);
    } catch (err) {
      alert('❌ บันทึกไม่สำเร็จ');
    }
  };

  // 3. ฟังก์ชันลบสินค้า
  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบ Lecture นี้ใช่ไหม?')) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`, authHeader);
      alert('✅ ลบเรียบร้อย!');
      setMyProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('❌ ลบไม่ได้: เกิดข้อผิดพลาด');
    }
  };

  // ✅ 4. เพิ่มฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('ออกจากระบบเรียบร้อย 👋');
    navigate('/login');
  };

  // คำนวณยอดเงิน (ถ้าอยากให้โชว์ยอดที่ได้รับแล้ว ให้เปลี่ยนเงื่อนไขเป็น 'PAID')
  const totalPending = payouts
    .filter(p => p.status === 'PENDING') // หรือ 'PAID' ถ้า backend เปลี่ยนเป็นจ่ายทันที
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPaid = payouts
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div style={{ padding: '20px', color: '#333', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* ✅ 5. ปรับ Header ให้มีปุ่ม Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>💰 แผงควบคุมผู้ขาย (Seller Dashboard)</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ออกจากระบบ 🚪
        </button>
      </div>

      {/* --- ส่วนที่ 1: จัดการบัญชีรับเงิน --- */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>💳 ช่องทางรับเงิน</h3>
          <button 
            onClick={() => isEditingBank ? handleSaveBank() : setIsEditingBank(true)}
            style={{ padding: '8px 15px', background: isEditingBank ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {isEditingBank ? 'บันทึก' : 'แก้ไขข้อมูล'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold' }}>ธนาคาร:</label>
            <select 
              disabled={!isEditingBank}
              value={bankInfo.bankName}
              onChange={e => setBankInfo({...bankInfo, bankName: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">-- เลือกธนาคาร --</option>
              <option value="KBANK">กสิกรไทย</option>
              <option value="SCB">ไทยพาณิชย์</option>
              <option value="KTB">กรุงไทย</option>
              <option value="BBL">กรุงเทพ</option>
              <option value="TTB">ทหารไทยธนชาต</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold' }}>เลขบัญชี:</label>
            <input 
              type="text" 
              disabled={!isEditingBank}
              value={bankInfo.bankAccountNumber}
              onChange={e => setBankInfo({...bankInfo, bankAccountNumber: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              placeholder="xxx-x-xxxxx-x"
            />
          </div>
        </div>
      </div>

      {/* --- ส่วนที่ 2: รายการ Lecture ของฉัน --- */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>📚 Lecture ที่ลงขาย ({myProducts.length})</h2>
          <Link to="/add-product">
            <button style={{ padding: '10px 20px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              + ลงขาย Lecture ใหม่
            </button>
          </Link>
        </div>
        
        {myProducts.length === 0 ? (
          <div style={{ padding: '20px', background: '#f1f1f1', borderRadius: '10px', textAlign: 'center', color: '#666' }}>
            คุณยังไม่ได้ลงขายสินค้าเลย เริ่มต้นลงขายกันเถอะ!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {myProducts.map(p => (
              <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '140px', background: '#f0f0f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? (
                      <img src={`http://localhost:3000/uploads/${p.image}`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>📦</span>
                    )}
                </div>
                <div style={{ padding: '15px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h4>
                  <p style={{ margin: '0 0 10px 0', color: '#28a745', fontWeight: 'bold' }}>฿{p.price.toLocaleString()}</p>
                  
                  {/* ปุ่มแก้ไข และ ปุ่มลบ */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/edit/${p.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '8px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        แก้ไข
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      style={{ flex: 1, padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ลบ
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ส่วนที่ 3: สรุปยอดเงินและประวัติ --- */}
      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* แสดงยอดที่โอนแล้ว (PAID) เนื่องจากเราเปลี่ยนระบบให้โอนทันที */}
        <div style={{ background: '#d4edda', padding: '20px', borderRadius: '10px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
          <h3>ยอดเงินที่ได้รับแล้ว (PAID)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>฿{totalPaid.toLocaleString()}</p>
        </div>
        <div style={{ background: '#d1ecf1', padding: '20px', borderRadius: '10px', textAlign: 'center', border: '1px solid #bee5eb' }}>
          <h3>รายการขายทั้งหมด</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c5460' }}>{payouts.length} รายการ</p>
        </div>
      </div>

      <h2>📜 ประวัติรายได้</h2>
      {loading ? <p>กำลังโหลด...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#343a40', color: 'white' }}>
              <th style={{ padding: '12px' }}>วันที่</th>
              <th>Order ID</th>
              <th>จำนวนเงิน</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>ยังไม่มีรายการขาย</td></tr>
            ) : payouts.map(payout => (
              <tr key={payout.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center', background: 'white' }}>
                <td style={{ padding: '12px' }}>{new Date(payout.createdAt).toLocaleDateString()}</td>
                <td>#{payout.order?.id}</td>
                <td>฿{Number(payout.amount).toLocaleString()}</td>
                <td style={{ fontWeight: 'bold', color: payout.status === 'PAID' ? '#28a745' : '#ffc107' }}>
                  {payout.status === 'PENDING' ? '⏳ รอแอดมินโอน' : '✅ โอนแล้ว'}
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