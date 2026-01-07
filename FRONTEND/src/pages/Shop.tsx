// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/products').then(res => setProducts(res.data));
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      {/* ช่องค้นหา */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหาสรุปวิชา..." 
          className="form-control"
          style={{ padding: '15px 25px', borderRadius: '30px', border: '2px solid #ddd', fontSize: '1.1rem' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* รายการสินค้า Grid */}
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={`http://localhost:3000/uploads/${product.image}`} alt={product.title} className="product-img" />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>{product.description.substring(0, 100)}...</p>
              <div className="product-footer">
                <span className="price">฿{product.price}</span>
                {user?.role === 'seller' || user?.role === 'admin' ? (
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>(โหมดดูตัวอย่าง)</span>
                ) : (
                  <button onClick={() => addToCart(product)} className="btn-add">
                    🛒 ใส่ตะกร้า
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}