import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.PNG";

export default function Header() {

  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "হোম" },
    { to: "/about", label: "আমাদের সম্পর্কে" },
    { to: "/our-work", label: "আমাদের কাজ" },
    { to: "/request-help", label: "সাহায্যের আবেদন" },
    { to: "/contact", label: "যোগাযোগ" },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-white/20 text-emerald-200"
        : "text-white hover:bg-white/10"
    }`;

  return (

    <header className="sticky top-0 z-50 shadow-md bg-emerald-700">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">

          <img
            src={logo}
            alt="logo"
            className="h-10 w-10 rounded-full bg-white p-1"
          />

          <div>
            <p className="text-white font-bold text-sm">
              বদর উদ্দিন বেপারী কল্যাণ সংস্থা
            </p>

            <p className="text-emerald-200 text-xs">
              সেবা ও উন্নয়ন’ই আমাদের মূল লক্ষ্য
            </p>
          </div>

        </Link>

        <nav className="hidden lg:flex gap-1">

          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}

        </nav>

        <div className="hidden lg:flex gap-2">

          {isLoggedIn ? (

            <>
              <Link
                to="/portal/dashboard"
                className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold"
              >
                ড্যাশবোর্ড
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                লগআউট
              </button>
            </>

          ) : (

            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm"
              >
                সদস্য লগইন
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 border border-white text-white rounded-lg text-sm"
              >
                নিবন্ধন
              </Link>
            </>

          )}

        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {menuOpen && (

        <div className="lg:hidden px-4 pb-4 flex flex-col gap-2 bg-emerald-700">

          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="text-white px-3 py-2"
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
            <>
              <Link
                to="/login"
                className="text-white px-3 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Member Login
              </Link>
              <Link
                to="/register"
                className="text-emerald-200 px-3 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                নিবন্ধন করুন
              </Link>
            </>
          )}
        </div>

      )}

    </header>

  );
}