import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { authFetch, getApiUrl } from "@/lib/api";

export interface UserProfile {
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  mobileNumber: string;
  email?: string;
  role: string;
  profile?: UserProfile;
  createdAt?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  profile?: Partial<UserProfile>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginId: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, mobileNumber: string, password: string, email?: string, username?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const normalizeUser = (raw: any): User => ({
  ...raw,
  id: raw?.id || raw?._id?.toString?.() || raw?._id || "",
  profile: raw?.profile || {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const API_URL = getApiUrl();

  const refreshUser = useCallback(async () => {
    const storedToken =
      localStorage.getItem("canvas_token") || sessionStorage.getItem("canvas_token");
    if (!storedToken) return;

    try {
      const result = await authFetch("/auth/me");
      setUser(normalizeUser(result.data));
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken =
        localStorage.getItem("canvas_token") || sessionStorage.getItem("canvas_token");
      if (storedToken) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw new Error(`Server returned ${res.status}`);

          const text = await res.text();
          const result = text ? JSON.parse(text) : {};

          if (result.success) {
            setUser(normalizeUser(result.data));
            setToken(storedToken);
          } else {
            localStorage.removeItem("canvas_token");
            sessionStorage.removeItem("canvas_token");
          }
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem("canvas_token");
          sessionStorage.removeItem("canvas_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [API_URL]);

  const login = async (loginId: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        if (res.status === 404) {
          throw new Error("Endpoint not found (404). Is the server running?");
        }
        const snippet = text.substring(0, 150).replace(/<[^>]+>/g, "").trim();
        throw new Error(`Server Error (${res.status}): ${snippet || "Internal Server Error"}`);
      }

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      const { user: userData, token: authToken } = result.data;
      setUser(normalizeUser(userData));
      setToken(authToken);
      if (rememberMe) {
        localStorage.setItem("canvas_token", authToken);
        sessionStorage.removeItem("canvas_token");
      } else {
        sessionStorage.setItem("canvas_token", authToken);
        localStorage.removeItem("canvas_token");
      }

      setIsAuthModalOpen(false);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    mobileNumber: string,
    password: string,
    email?: string,
    _username?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber, password, email }),
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        if (res.status === 404) {
          throw new Error("Endpoint not found (404). Is the server running?");
        }
        const snippet = text.substring(0, 150).replace(/<[^>]+>/g, "").trim();
        throw new Error(`Server Error (${res.status}): ${snippet || "Internal Server Error"}`);
      }

      if (!result.success) {
        throw new Error(result.message || "Signup failed");
      }

      const { user: userData, token: authToken } = result.data;
      setUser(normalizeUser(userData));
      setToken(authToken);
      localStorage.setItem("canvas_token", authToken);

      setIsAuthModalOpen(false);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      const result = await authFetch("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setUser(normalizeUser(result.data));
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authFetch("/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("canvas_token");
    sessionStorage.removeItem("canvas_token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
