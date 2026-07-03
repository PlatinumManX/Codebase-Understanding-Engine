import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '../../../shared/context/ToastContext';
import useRoute from '../../../shared/hooks/useRoute';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { navigate } = useRoute();

  useEffect(() => {
    const storedUser = localStorage.getItem('codemap_user');
    const storedToken = localStorage.getItem('codemap_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (email, password, rememberMe) => {
    // Basic validation
    if (!email || !password) {
      showToast('error', 'Required fields missing');
      return false;
    }

    // Email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Invalid email format');
      return false;
    }

    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return false;
    }

    const mockUser = {
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email: email,
      role: email === 'admin@codemap.ai' ? 'Lead Architect' : 'Developer'
    };
    const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);

    localStorage.setItem('codemap_user', JSON.stringify(mockUser));
    localStorage.setItem('codemap_token', mockToken);
    setUser(mockUser);
    setToken(mockToken);

    showToast('success', 'Login Successful');
    navigate('dashboard', true);
    return true;
  };

  const register = (fullName, email, password, confirmPassword, acceptTerms) => {
    if (!fullName || !email || !password || !confirmPassword) {
      showToast('error', 'Required fields missing');
      return false;
    }

    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return false;
    }

    if (!acceptTerms) {
      showToast('error', 'You must agree to the Terms of Service');
      return false;
    }

    const mockUser = {
      name: fullName,
      email: email,
      role: 'Developer'
    };
    const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);

    localStorage.setItem('codemap_user', JSON.stringify(mockUser));
    localStorage.setItem('codemap_token', mockToken);
    setUser(mockUser);
    setToken(mockToken);

    showToast('success', 'Registration Successful');
    navigate('dashboard', true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('codemap_user');
    localStorage.removeItem('codemap_token');
    setUser(null);
    setToken(null);
    showToast('success', 'Logout Successful');
    navigate('landing', true);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
