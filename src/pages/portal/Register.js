import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Mail, Phone, Lock, Upload, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo-circle.png";
import RegisterOTPStep from "./RegisterOTP";

export default function Register() {
  const [form, setForm] = useState({
    name: "", fatherName: "", email: "", phone: "", password: "", confirm: "",
  });
  const [photo, setPhoto]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [showOTP, setShowOTP]       = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৫ MB এর বেশি হবে না");
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.fatherName || !form.email || !form.phone || !form.password)
      return toast.error("সব তথ্য দিন");
    if (form.password !== form.confirm)
      return toast.error("পাসওয়ার্ড মিলছে না");
    if (form.password.length < 6)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
    if (!photo)
      return toast.error("প্রোফাইল ছবি দিন");

    setLoading(true);
    try {
      await api.post("/auth/send-register-otp", { email: form.email });
      toast.success("OTP পাঠানো হয়েছে!");
      setShowOTP(true);
    } catch (err) {
      const msg = err.response?.data?.message || "সমস্যা হয়েছে";
      if (msg.includes("ইমেইল") || msg.includes("email") || msg.includes("already")) {
        toast.error("এই ইমেইল আগে ব্যবহার হয়েছে। অন্য ইমেইল দিন।");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-7">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">
            {showOTP ? "ইমেইল যাচাই" : "নতুন সদস্য নিবন্ধন"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {showOTP
              ? "আপনার ইমেইলে পাঠানো OTP দিয়ে যাচাই করুন"
              : "অ্যাডমিন অনুমোদনের পর লগইন করতে পারবেন"}
          </p>
        </div>

        {/* OTP Step */}
        {showOTP ? (
          <RegisterOTPStep
            email={form.email}
            formData={{
              name:       form.name,
              fatherName: form.fatherName,
              email:      form.email,
              phone:      form.phone,
              password:   form.password,
            }}
            photoFile={photo}
            onSuccess={() => navigate("/login")}
            onBack={() => setShowOTP(false)}
          />
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Photo upload */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-emerald-300 group-hover:border-emerald-500 overflow-hidden flex items-center justify-center bg-emerald-50 transition">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={20} className="text-emerald-400 mx-auto" />
                      <span className="text-xs text-emerald-400 mt-1 block">ছবি</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            </div>

            {/* Name + Father Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">নাম *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="আপনার নাম"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">বাবার নাম *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    placeholder="বাবার নাম"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">হোয়াটসঅ্যাপ নম্বর *</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">আবার লিখুন *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••"
                    className={`w-full pl-9 pr-9 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      form.confirm && form.password !== form.confirm
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  OTP পাঠানো হচ্ছে...
                </span>
              ) : (
                "পরবর্তী ধাপ →"
              )}
            </button>
          </form>
        )}

        {/* Footer link */}
        {!showOTP && (
          <p className="text-center text-sm text-gray-500 mt-5">
            আগেই অ্যাকাউন্ট আছে?{" "}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              লগইন করুন
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}