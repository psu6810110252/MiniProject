import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: number;
  price: number;
  product: {
    title: string;
    image: string;
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>📜 ประวัติการสั่งซื้อ</h1>
        <Link to="/"><button style={{ padding: '10px', cursor: 'pointer' }}>🏠 กลับหน้าหลัก</button></Link>
      </div>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#aaa' }}>ยังไม่มีรายการสั่งซื้อ...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#222', padding: '20px', borderRadius: '10px', border: '1px solid #444' }}>
              
              {/* หัวบิล */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Order #{order.id}</span>
                  <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    color: order.status === 'PENDING' ? 'orange' : 'lightgreen', 
                    fontWeight: 'bold' 
                  }}>
                    {order.status === 'PENDING' ? '⏳ รอตรวจสอบ' : '✅ อนุมัติแล้ว'}
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>฿{order.totalPrice}</div>
                </div>
              </div>

              {/* รายการสินค้าในบิล */}
              {order.orderItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                  {item.product.image ? (
                     <img src={`http://localhost:3000/uploads/${item.product.image}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', background: '#555', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                  )}
                  <div>
                    <div>{item.product.title}</div>
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>฿{item.price}</div>
                  </div>
                </div>
              ))}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;