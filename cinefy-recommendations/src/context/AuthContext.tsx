import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cinefy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('cinefy_users') || '[]');
    const existingUser = users.find((u: { email: string; password: string }) => 
      u.email === email && u.password === password
    );
    
    if (existingUser) {
      const userData = { email: existingUser.email, name: existingUser.name };
      setUser(userData);
      localStorage.setItem('cinefy_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('cinefy_users') || '[]');
    const existingUser = users.find((u: { email: string }) => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem('cinefy_users', JSON.stringify(users));
    
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('cinefy_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinefy_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
