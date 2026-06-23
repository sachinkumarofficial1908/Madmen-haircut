import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salon_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('salon_token', data.token);
    localStorage.setItem('salon_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('salon_token', data.token);
    localStorage.setItem('salon_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('salon_token');
    localStorage.removeItem('salon_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setLoading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
