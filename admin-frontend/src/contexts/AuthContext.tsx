'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials } from '@/types/auth';

// Add AuthResponse interface
interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false); // Changed from true since we're not using it
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    if (!data.access_token) {
      throw new Error('No access token received');
    }

    localStorage.setItem('token', data.access_token);
    
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });

    if (!userResponse.ok) {
      localStorage.removeItem('token');
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    if (!userData.is_admin) {
      localStorage.removeItem('token');
      throw new Error('Not authorized as admin');
    }

    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};