import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'; // ✅ นำเข้า Provider
import { AuthProvider } from './context/AuthContext.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    ReactDom.createRoot(document.getElementById('root')!).render( 
    <AuthProvider>
      <CartProvider> {/* ✅ หุ้ม App ไว้ */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)