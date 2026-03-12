import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import logo from "../../assets/logo2.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/portal/dashboard";

  if (isLoggedIn) { navigate(from, { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("সব তথ্য পূরণ করুন"); return; }
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success("লগইন সফল হয়েছে!");
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">সদস্য লগইন</h1>
          <p className="text-gray-500 text-sm mt-1">
            আপনার ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-5 text-center space-y-2">
          <p className="text-sm text-gray-500">
            নতুন সদস্য?{" "}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
              নিবন্ধন করুন
            </Link>
          </p>
          <p>
            <Link to="/" className="text-sm text-gray-400 hover:text-emerald-600 transition">
              ← হোমে ফিরে যান
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
