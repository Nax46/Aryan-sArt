import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  mobileNumber: string;
  email?: string;
  role: string;
  profile?: {
    avatar?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (mobileNumber: string, password: string) => Promise<void>;
  signup: (name: string, mobileNumber: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const getApiUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // In production (on oncanvas.in), always use the relative /api path
  if (hostname === 'www.oncanvas.in' || hostname === 'oncanvas.in') {
    return '/api';
  }
  
  // Fallback to env variable if present
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  return '/api';
};
const API_URL = getApiUrl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("canvas_token");
      if (storedToken) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
          }
          
          const text = await res.text();
          const result = text ? JSON.parse(text) : {};
          
          if (result.success) {
            setUser(result.data);
            setToken(storedToken);
          } else {
            localStorage.removeItem("canvas_token");
          }
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem("canvas_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (mobileNumber: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, password })
      });
      
      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        if (res.status === 404) {
          throw new Error("Endpoint not found (404). Is the server running?");
        }
        let snippet = text.substring(0, 150).replace(/<[^>]+>/g, '').trim();
        throw new Error(`Server Error (${res.status}): ${snippet || "Internal Server Error"}`);
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const { user, token } = result.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("canvas_token", token);
      
      setIsAuthModalOpen(false);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, mobileNumber: string, password: string, email?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobileNumber, password, email })
      });
      
      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        if (res.status === 404) {
          throw new Error("Endpoint not found (404). Is the server running?");
        }
        let snippet = text.substring(0, 150).replace(/<[^>]+>/g, '').trim();
        throw new Error(`Server Error (${res.status}): ${snippet || "Internal Server Error"}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Signup failed');
      }

      const { user, token } = result.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("canvas_token", token);
      
      setIsAuthModalOpen(false);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("canvas_token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      signup, 
      logout, 
      isAuthModalOpen, 
      setIsAuthModalOpen 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
