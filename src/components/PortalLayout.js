import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  DollarSign,
  TrendingDown,
  HelpCircle,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  Newspaper,
  UserCircle,
  User,
} from "lucide-react";
import memberLogo from "../assets/member_logo.jpeg";
import Header from "./Header";

export default function PortalLayout({ children }) {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasAdminAccess = isAdmin || isSuperAdmin;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/portal/dashboard", icon: <LayoutDashboard size={18} />, label: "ড্যাশবোর্ড" },
    { to: "/portal/donations", icon: <DollarSign size={18} />, label: "অনুদানের তালিকা" },
    { to: "/portal/spending", icon: <TrendingDown size={18} />, label: "তহবিল খরচ" },
    ...(hasAdminAccess
      ? [
          {
            to: "/portal/help-requests",
            icon: <HelpCircle size={18} />,
            label: "সাহায্যের আবেদন",
          },
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
        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  const getSidebarBadge = () => {
    if (isSuperAdmin) return { label: "Creator", cls: "bg-purple-400 text-purple-900" };
    if (user?.role === "admin") return { label: "Admin", cls: "bg-yellow-400 text-yellow-900" };
    return { label: "Member", cls: "bg-emerald-200 text-emerald-800" };
  };

  const badge = getSidebarBadge();

  const Sidebar = () => (
    <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg">
      <div className="border-b p-5" style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
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
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={16} /> লগআউট
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="w-64">
              <Sidebar />
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b bg-white p-4 shadow-sm lg:hidden">
            <button onClick={() => setSidebarOpen(true)}>
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
            <p className="font-semibold text-emerald-700">{user?.name}</p>
          </div>
          <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
