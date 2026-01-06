import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // ✅ ย้ายมาที่นี่
import { CartProvider } from './context/CartContext' // ✅ ย้ายมาที่นี่

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      {/* 2. ตามด้วย AuthProvider (เพื่อให้ใช้ navigate ได้) */}
      <AuthProvider>
        {/* 3. ตามด้วย CartProvider */}
        <CartProvider>
          {/* 4. แอพอยู่ข้างในสุด */}
          <App />
        </CartProvider>
      </AuthProvider>
  </React.StrictMode>,
)