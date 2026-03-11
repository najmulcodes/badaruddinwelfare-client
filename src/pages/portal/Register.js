import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Lock, Mail, User, Phone, UserCircle, Camera } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "", fatherName: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const { register, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) { navigate("/portal/dashboard", { replace: true }); return null; }

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) { toast.error("ছবি আপলোড করুন"); return; }
    if (!form.name || !form.fatherName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error("সব তথ্য পূরণ করুন"); return;
    }
    if (form.password !== form.confirmPassword) { toast.error("পাসওয়ার্ড মিলছে না"); return; }
    if (form.password.length < 6) { toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"); return; }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("name", form.name);
    formData.append("fatherName", form.fatherName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);

    const result = await register(formData);
    if (result.success) {
      toast.success("নিবন্ধন সফল হয়েছে!");
      navigate("/portal/dashboard", { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
            <UserCircle size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">নতুন সদস্য নিবন্ধন</h1>
          <p className="text-gray-500 text-sm mt-1">নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-100 overflow-hidden bg-gray-100 flex items-center justify-center">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <UserCircle size={48} className="text-gray-300" />}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            </div>
            <p className="text-xs text-gray-400">ছবি আপলোড করুন <span className="text-red-400">*</span></p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পূর্ণ নাম <span className="text-red-400">*</span></label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="আপনার পূর্ণ নাম"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
            </div>
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পিতার নাম <span className="text-red-400">*</span></label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={form.fatherName}
                onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                placeholder="পিতার পূর্ণ নাম"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল <span className="text-red-400">*</span></label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ফোন / হোয়াটসঅ্যাপ নম্বর <span className="text-red-400">*</span></label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="০১XXXXXXXXX"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড <span className="text-red-400">*</span></label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? "text" : "password"} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-400">*</span></label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? "text" : "password"} value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required />
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">❌ পাসওয়ার্ড মিলছে না</p>
            )}
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="text-emerald-500 text-xs mt-1">✓ পাসওয়ার্ড মিলেছে</p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
            {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">লগইন করুন</Link>
        </p>
        <div className="mt-3 text-center">
          <Link to="/" className="text-sm text-emerald-600 hover:underline">← হোমে ফিরে যান</Link>
        </div>
      </div>
    </div>
  );
}