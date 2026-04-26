import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session on mount
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic: accept anything with admin, otherwise normal user
    // For demo purposes, let's say "admin@group.com" with password "password" is valid.
    // Or just accept any email that starts with "admin"
    if (!email || !password) {
      throw new Error("EMPTY_FIELDS");
    }

    if (email === 'admin@group.com' && password === 'admin') {
      const mockUser: User = { id: 'admin_1', email, role: 'admin' };
      setUser(mockUser);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      return;
    }

    if (email.includes('@')) {
       // Mock regular user login
       const mockUser: User = { id: 'user_1', email, role: 'user' };
       setUser(mockUser);
       localStorage.setItem('mock_user', JSON.stringify(mockUser));
       return;
    }

    throw new Error("INVALID_CREDENTIALS");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
