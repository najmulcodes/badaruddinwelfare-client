import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Mail, Lock, KeyRound } from "lucide-react";
import logo from "../../assets/logo.png";

const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3, DONE: 4 };

export default function ForgotPassword() {
  const [step, setStep]         = useState(STEPS.EMAIL);
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [newPassword, setNew]   = useState("");
  const [confirmPw, setConfirm] = useState("");
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Start 60s resend countdown
  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP পাঠানো হয়েছে!");
      setStep(STEPS.OTP);
      startCountdown();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP আবার পাঠানো হয়েছে");
      startCountdown();
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("৬ সংখ্যার OTP দিন");
    setLoading(true);
    try {
      await api.post("/auth/verify-reset-otp", { email, otp: code });
      toast.success("OTP সঠিক!");
      setStep(STEPS.PASSWORD);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP সঠিক নয়");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPw) return toast.error("পাসওয়ার্ড মিলছে না");
    if (newPassword.length < 6) return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp: otp.join(""), newPassword });
      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে!");
      setStep(STEPS.DONE);
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <img src={logo} alt="Logo" className="w-14 h-14 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">পাসওয়ার্ড পুনরুদ্ধার</h1>
        </div>

        {/* Step 1 — Email */}
        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-sm text-gray-500 text-center">আপনার নিবন্ধিত ইমেইল দিন। আমরা একটি OTP পাঠাব।</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#065f46,#10b981)" }}>
              {loading ? "পাঠানো হচ্ছে..." : "OTP পাঠান"}
            </button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === STEPS.OTP && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <p className="text-sm text-gray-500 text-center">
              <strong>{email}</strong> এ পাঠানো ৬ সংখ্যার কোড দিন।
            </p>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input key={i} ref={(el) => (inputRefs.current[i] = el)}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              ))}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#065f46,#10b981)" }}>
              {loading ? "যাচাই হচ্ছে..." : "OTP যাচাই করুন"}
            </button>
            <div className="text-center">
              <button type="button" onClick={handleResend} disabled={countdown > 0 || loading}
                className={`text-sm font-medium transition ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-emerald-600 hover:underline"}`}>
                {countdown > 0 ? `পুনরায় পাঠান (${countdown}s)` : "OTP আবার পাঠান"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3 — New Password */}
        {step === STEPS.PASSWORD && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-500 text-center">নতুন পাসওয়ার্ড সেট করুন।</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={confirmPw} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${confirmPw && newPassword !== confirmPw ? "border-red-400 bg-red-50" : ""}`}
                  required />
              </div>
              {confirmPw && newPassword !== confirmPw && (
                <p className="text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#065f46,#10b981)" }}>
              {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
            </button>
          </form>
        )}

        {/* Step 4 — Done */}
        {step === STEPS.DONE && (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <p className="font-bold text-gray-800 text-lg">পাসওয়ার্ড পরিবর্তন হয়েছে!</p>
            <p className="text-gray-500 text-sm">এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।</p>
            <Link to="/login"
              className="inline-block px-6 py-3 font-bold text-white rounded-lg transition"
              style={{ background: "linear-gradient(135deg,#065f46,#10b981)" }}>
              লগইন করুন
            </Link>
          </div>
        )}

        {step !== STEPS.DONE && (
          <div className="mt-5 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:text-emerald-600 transition">
              ← লগইনে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}