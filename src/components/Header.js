import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo2.png";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    { to: "/our-work", label: "OUR WORK" },
    { to: "/request-help", label: "REQUEST HELP" },
    { to: "/contact", label: "CONTACT" },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white/20 text-emerald-200 font-bold"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <header
      className="sticky top-0 z-50 shadow-md"
      style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-11 w-11 rounded-full object-contain bg-white p-0.5 border-2 border-white/40"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              বদর উদ্দিন বেপারী কল্যাণ সংস্থা
            </p>
            <p className="text-emerald-200 text-xs">
              "সেবা ও উন্নয়নই আমাদের মূল লক্ষ্য"
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/portal/dashboard"
                className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition"
            >
              Member Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-2" style={{ background: "#065f46" }}>
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                to="/portal/dashboard"
                className="text-white px-3 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="text-left text-red-300 px-3 py-2 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white px-3 py-2 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Member Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
