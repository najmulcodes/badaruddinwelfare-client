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
  // isSuperAdmin: role field is "superAdmin" OR the hardcoded super-admin email
  const isSuperAdmin =
    user?.role === "superAdmin" || user?.email === SUPER_ADMIN_EMAIL;

  // isAdmin: any admin level (admin OR superAdmin)
  const isAdmin = user?.role === "admin" || isSuperAdmin;

  const isLoggedIn = !!user;

  /**
   * getRoleBadge() — returns a display label and Tailwind colour classes
   * suitable for use anywhere in the UI (sidebar, member cards, tables).
   *
   * superAdmin → "Creator"   (purple)
   * admin      → "Admin"     (yellow)
   * member     → "Member"    (emerald)
   */
  const getRoleBadge = (targetUser = user) => {
    const superAdminCheck =
      targetUser?.role === "superAdmin" ||
      targetUser?.email === SUPER_ADMIN_EMAIL;

    if (superAdminCheck)
      return { label: "Creator", cls: "bg-purple-100 text-purple-700" };
    if (targetUser?.role === "admin")
      return { label: "Admin", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "Member", cls: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        logout,
        isAdmin,       // true for admin + superAdmin
        isSuperAdmin,  // true only for superAdmin / hardcoded email
        isLoggedIn,
        getRoleBadge,  // helper: pass any user object → { label, cls }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
