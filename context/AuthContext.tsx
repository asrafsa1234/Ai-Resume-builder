import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import * as authService from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const user = await authService.login(email, pass);
      localStorage.setItem('app_user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: err.message || 'Login failed',
      }));
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('app_user');
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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