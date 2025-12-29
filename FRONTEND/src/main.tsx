import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'; // ✅ นำเข้า Provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider> {/* ✅ หุ้ม App ไว้ */}
      <App />
    </CartProvider>
  </StrictMode>,
)