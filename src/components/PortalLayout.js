import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, DollarSign, TrendingDown, HelpCircle,
  MessageSquare, Users, LogOut, Menu, Newspaper, UserCircle, User
} from "lucide-react";
import memberLogo from "../assets/member_logo.jpeg";
import Header from "./Header";

export default function PortalLayout({ children }) {
  const { user, isAdmin, isSuperAdmin, logout, getRoleBadge } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Any user with admin-level access (admin OR superAdmin)
  const hasAdminAccess = isAdmin || isSuperAdmin;

  const handleLogout = () => { logout(); navigate("/login"); };

  const links = [
    { to: "/portal/dashboard",     icon: <LayoutDashboard size={18} />, label: "ড্যাশবোর্ড" },
    { to: "/portal/donations",     icon: <DollarSign size={18} />,      label: "অনুদান লগ" },
    { to: "/portal/spending",      icon: <TrendingDown size={18} />,    label: "তহবিল ব্যয়" },
    { to: "/portal/help-requests", icon: <HelpCircle size={18} />,      label: "সাহায্যের আবেদন" },
    ...(hasAdminAccess ? [{ to: "/portal/messages", icon: <MessageSquare size={18} />, label: "বার্তা" }] : []),
    { to: "/portal/news-manage",   icon: <Newspaper size={18} />,       label: "সংবাদ" },
    { to: "/portal/my-profile",    icon: <User size={18} />,            label: "আমার প্রোফাইল" },
    { to: "/portal/profile",       icon: <UserCircle size={18} />,      label: "প্রোফাইল সম্পাদনা" },
    ...(hasAdminAccess ? [{ to: "/portal/admin", icon: <Users size={18} />, label: "অ্যাডমিন প্যানেল" }] : []),
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  // Use the shared getRoleBadge helper from AuthContext for the logged-in user.
  // Sidebar badge colours differ from table badge colours intentionally (richer bg).
  const getSidebarBadge = () => {
    if (isSuperAdmin) return { label: "Creator",  cls: "bg-purple-400 text-purple-900" };
    if (user?.role === "admin") return { label: "Admin", cls: "bg-yellow-400 text-yellow-900" };
    return { label: "Member", cls: "bg-emerald-200 text-emerald-800" };
  };

  const badge = getSidebarBadge();

  const Sidebar = () => (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
      <div className="p-5 border-b" style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={user?.image || memberLogo}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
            onError={(e) => { e.target.src = memberLogo; }}
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">{user?.name}</p>
            <p className="text-emerald-200 text-xs truncate max-w-[130px]">{user?.email}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
            {l.icon} {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
        >
          <LogOut size={16} /> লগআউট
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ── Header rendered at top of every portal page ── */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex"><Sidebar /></div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="w-64"><Sidebar /></div>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b shadow-sm">
            <button onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <img
              src={user?.image || memberLogo}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-400"
              onError={(e) => { e.target.src = memberLogo; }}
            />
            <p className="font-semibold text-emerald-700">{user?.name}</p>
          </div>
          <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
