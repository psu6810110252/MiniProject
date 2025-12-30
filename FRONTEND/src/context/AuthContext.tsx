import { createContext, useContext, useState } from "react";

export type Role = "admin" | "seller" | "buyer";

export interface User {
  id: number;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const role = localStorage.getItem("role") as Role | null;
    if (!role) return null;
    return { id: 0, role };
  });

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
