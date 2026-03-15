import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  DollarSign,
  TrendingDown,
  HelpCircle,
  MessageSquare,
  Users,
  Menu,
  Newspaper,
  UserCircle,
  User,
  Moon,
  Sun,
} from "lucide-react";
import memberLogo from "../assets/member_logo.jpeg";
import Header from "./Header";

export default function PortalLayout({ children }) {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const hasAdminAccess = isAdmin || isSuperAdmin;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const links = [
    { to: "/portal/dashboard", icon: <LayoutDashboard size={18} />, label: "ড্যাশবোর্ড" },
    { to: "/portal/donations", icon: <DollarSign size={18} />, label: "অনুদানের তালিকা" },
    { to: "/portal/spending", icon: <TrendingDown size={18} />, label: "তহবিল খরচ" },
    ...(hasAdminAccess
      ? [
          { to: "/portal/help-requests", icon: <HelpCircle size={18} />, label: "সাহায্যের আবেদন" },
          { to: "/portal/messages", icon: <MessageSquare size={18} />, label: "মেসেজ" },
          { to: "/portal/news-manage", icon: <Newspaper size={18} />, label: "সংবাদ" },
        ]
      : []),
    { to: "/portal/my-profile", icon: <User size={18} />, label: "আমার প্রোফাইল" },
    { to: "/portal/profile", icon: <UserCircle size={18} />, label: "প্রোফাইল বদলান" },
    ...(hasAdminAccess
      ? [{ to: "/portal/admin", icon: <Users size={18} />, label: "অ্যাডমিন প্যানেল" }]
      : []),
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-emerald-300"
    }`;

  const getSidebarBadge = () => {
    if (isSuperAdmin) return { label: "Creator", cls: "bg-purple-400 text-purple-900" };
    if (user?.role === "admin") return { label: "Admin", cls: "bg-yellow-400 text-yellow-900" };
    return { label: "Member", cls: "bg-emerald-200 text-emerald-800" };
  };

  const badge = getSidebarBadge();

  const ThemeButton = ({ mobile = false }) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        mobile
          ? "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{theme === "dark" ? "লাইট মোড" : "ডার্ক মোড"}</span>
    </button>
  );

  const Sidebar = () => (
    <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg dark:bg-gray-900 dark:shadow-gray-950/40">
      <div
        className="border-b border-emerald-700/20 p-5 dark:border-gray-800"
        style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
      >
        <div className="mb-2 flex items-center gap-3">
          <img
            src={user?.image || memberLogo}
            alt={user?.name}
            className="h-12 w-12 rounded-full border-2 border-white/60 object-cover"
            onError={(e) => {
              e.target.src = memberLogo;
            }}
          />
          <div>
            <p className="text-sm font-bold leading-tight text-white">{user?.name}</p>
            <p className="max-w-[130px] truncate text-xs text-emerald-200">{user?.email}</p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
      </div>

      <div className="p-4">
        <ThemeButton />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="w-64 max-w-[85vw]">
              <Sidebar />
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200">
              <Menu size={22} />
            </button>
            <img
              src={user?.image || memberLogo}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-emerald-400 object-cover"
              onError={(e) => {
                e.target.src = memberLogo;
              }}
            />
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">{user?.name}</p>
            <div className="ml-auto">
              <ThemeButton mobile />
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
