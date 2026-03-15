import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo-circle.png";

export default function Login() {
  const [form, setForm]               = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, loading, isLoggedIn } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || "/portal/dashboard";

  useEffect(() => {
    if (isLoggedIn) return;
    const script = document.createElement("script");
    script.src   = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [isLoggedIn]);

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback:  handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "outline", size: "large", width: "100%", text: "signin_with", locale: "bn" }
    );
  };

  const handleGoogleResponse = async (response) => {
    const result = await googleLogin(response.credential);
    if (result.success) {
      toast.success("Google লগইন সফল!");
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-7">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">সদস্য লগইন</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার একাউন্টে প্রবেশ করুন</p>
        </div>

        {/* Google Login Button */}
        <div className="mb-5">
          <div id="google-btn" className="flex justify-center" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">অথবা ইমেইল দিয়ে</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-emerald-600 hover:underline font-medium"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                লগইন হচ্ছে...
              </span>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        <div className="mt-5 text-center space-y-2">
          <p className="text-sm text-gray-500">
            নতুন সদস্য?{" "}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
              নিবন্ধন করুন
            </Link>
          </p>
          <Link to="/" className="text-sm text-gray-400 hover:text-emerald-600 transition block">
            ← হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}