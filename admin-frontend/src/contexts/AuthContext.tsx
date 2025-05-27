'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user';
import type { LoginCredentials, AuthResponse } from '@/types/auth';

type AuthContextType = {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated');
        const userData: User = await res.json();
        if (!userData.is_admin) throw new Error('Not admin');
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Login failed');
    const data: AuthResponse = await response.json();
    if (!data.access_token) throw new Error('No access token received');

    localStorage.setItem('token', data.access_token);
    document.cookie = `token=${data.access_token}; path=/`;

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (!userResponse.ok) {
      localStorage.removeItem('token');
      throw new Error('Failed to fetch user data');
    }

    const userData: User = await userResponse.json();
    if (!userData.is_admin) {
      localStorage.removeItem('token');
      throw new Error('Not authorized as admin');
    }

    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/'; // Remove cookie
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}