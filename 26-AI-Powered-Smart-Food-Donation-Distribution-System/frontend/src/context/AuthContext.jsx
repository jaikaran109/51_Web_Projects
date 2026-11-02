import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sfd_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify session on load
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('sfd_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('sfd_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const demoLogin = async (role = 'donor') => {
    setError(null);
    try {
      const data = await api.post('/auth/demo-login', { role });
      if (data.success) {
        localStorage.setItem('sfd_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('sfd_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await api.put('/auth/updatedetails', profileData);
      if (data.success) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      if (data.success) setUser(data.user);
    } catch (err) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
