import React, { createContext, useContext, useState, useEffect } from 'react';
import { setToken, clearToken, setUnauthorizedCallback } from '@/lib/apiClient';

type UserRole = 'admin' | 'operador';

export interface User {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (u: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const USER_STORAGE_KEY = 'dycore_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaura sessão ao recarregar a página
    const saved = sessionStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem(USER_STORAGE_KEY);
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Registra callback para logout automático quando JWT expirar (401)
    setUnauthorizedCallback(() => {
      setUser(null);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    });
  }, []);

  const login = (u: User, token: string) => {
    setUser(u);
    setToken(token);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    clearToken();
    sessionStorage.removeItem(USER_STORAGE_KEY);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
