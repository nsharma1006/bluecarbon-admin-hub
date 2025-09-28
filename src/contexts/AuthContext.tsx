import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('bluecarbon_token');
    const storedUser = localStorage.getItem('bluecarbon_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      apiService.setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user || { id: '1', email });
        
        localStorage.setItem('bluecarbon_token', response.token);
        localStorage.setItem('bluecarbon_user', JSON.stringify(response.user || { id: '1', email }));
        
        apiService.setToken(response.token);
        toast({
          title: "Login successful",
          description: "Welcome to BlueCarbon Admin Panel",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials or server error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bluecarbon_token');
    localStorage.removeItem('bluecarbon_user');
    apiService.setToken(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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