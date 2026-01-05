import { createContext, useContext, useState } from "react";

export type Role = "admin" | "seller" | "buyer";

export interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User, token: string) => {
  // ✅ ตรวจสอบก่อนว่า userData มีค่าไหม ป้องกัน Error จอขาว
  if (!userData) {
    console.error("❌ Error: ไม่มีข้อมูล User ส่งมาที่ฟังก์ชัน login");
    return;
  }

  setUser(userData);
  localStorage.setItem('token', token);
  
  // ✅ ใช้ Fallback: ถ้าไม่มี role ให้ถือว่าเป็น 'user' ธรรมดาไปก่อน
  const userRole = userData.role || 'user';
  localStorage.setItem('role', userRole);
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
