
import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import type { User } from '../types';
import * as api from '../services/apiService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{status: 'success' | 'error', user?: User, message?: string}>;
  logout: () => void;
  updateUserContext: (user: User) => void;
  isAuthenticated: boolean;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('authToken'));

  useEffect(() => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser && token) {
          try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.role === 'admin') {
                setUser(parsedUser);
              } else {
                // If a non-admin role is somehow in storage, log them out.
                logout();
              }
          } catch {
              logout();
          }
      }
  }, [token]);

  const updateUserContext = (updatedUser: User) => {
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const handleAuthSuccess = (data: { user: User, token: string }) => {
      updateUserContext(data.user);
      setToken(data.token);
      sessionStorage.setItem('authToken', data.token);
  };
  
  const login = async (email: string, pass: string): Promise<{status: 'success' | 'error', user?: User, message?: string}> => {
    try {
      const data = await api.login(email, pass);
      handleAuthSuccess(data);
      return { status: 'success', user: data.user };
    } catch (error) {
      console.error("Login call failed:", error);
      if (axios.isAxiosError(error) || (error as any).isAxiosError) {
        if (!(error as any).response) {
            return { status: 'error', message: 'Network Error: Cannot connect to server. Please ensure the backend is running and CORS is configured.' };
        } else if ((error as any).response.status === 401 || (error as any).response.status === 403) {
            return { status: 'error', message: 'Login failed. Please check your email and password.' };
        }
      }
      return { status: 'error', message: 'An unexpected error occurred during login.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserContext, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
