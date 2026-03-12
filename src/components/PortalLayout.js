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
  UserCircle
} from "lucide-react";

import memberLogo from "../assets/member_logo.jpeg";

export default function PortalLayout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/portal/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/portal/donations", icon: <DollarSign size={18} />, label: "Donation Log" },
    { to: "/portal/spending", icon: <TrendingDown size={18} />, label: "Fund Spending" },
    { to: "/portal/help-requests", icon: <HelpCircle size={18} />, label: "Help Requests" },
    { to: "/portal/messages", icon: <MessageSquare size={18} />, label: "Messages" },
    { to: "/portal/news-manage", icon: <Newspaper size={18} />, label: "Manage News" },
    { to: "/portal/my-profile", icon: <UserCircle size={18} />, label: "My Profile" },
    ...(isAdmin ? [{ to: "/portal/admin", icon: <Users size={18} />, label: "Admin Panel" }] : [])
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  const Sidebar = () => (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">

      <div className="p-5 border-b bg-gradient-to-br from-emerald-900 to-emerald-500">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={user?.image || memberLogo}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
          />
          <div>
            <p className="text-white font-bold text-sm">{user?.name}</p>
            <p className="text-emerald-200 text-xs">{user?.email}</p>
          </div>
        </div>

        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          user?.role === "admin"
            ? "bg-yellow-400 text-yellow-900"
            : "bg-emerald-200 text-emerald-800"
        }`}>
          {user?.role === "admin" ? "Admin" : "Member"}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b shadow-sm">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <img
            src={user?.image || memberLogo}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-emerald-400"
          />

          <p className="font-semibold text-emerald-700">{user?.name}</p>
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}