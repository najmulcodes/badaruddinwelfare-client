import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const SUPER_ADMIN_EMAIL = "admin@shariar.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // Email/password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "লগইন করতে সমস্যা হয়েছে",
      };
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async (idToken) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/google-login", { idToken });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Google লগইনে সমস্যা হয়েছে",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ── Role helpers ──
  const isSuperAdmin = user?.role === "superAdmin" || user?.email === SUPER_ADMIN_EMAIL;
  const isAdmin      = user?.role === "admin" || isSuperAdmin;
  const isLoggedIn   = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        logout,
        isAdmin,       // true for admin + superAdmin
        isSuperAdmin,  // true only for superAdmin
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
