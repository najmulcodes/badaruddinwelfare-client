import React, { useState, useRef } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function RegisterOTPStep({ email, formData, photoFile, onSuccess, onBack }) {
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Start countdown on mount
  React.useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, []);

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

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await api.post("/auth/send-register-otp", { email });
      toast.success("OTP আবার পাঠানো হয়েছে");
      setCountdown(60);
      const t = setInterval(() => {
        setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
      }, 1000);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("৬ সংখ্যার OTP দিন");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("otp", code);
      if (photoFile) fd.append("image", photoFile);

      await api.post("/auth/verify-register-otp", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("নিবন্ধন সফল! অ্যাডমিন অনুমোদনের পর লগইন করতে পারবেন।");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP সঠিক নয়");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <strong>{email}</strong> এ পাঠানো ৬ সংখ্যার কোড দিন
        </p>
      </div>
      <form onSubmit={handleVerify} className="space-y-5">
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
          {loading ? "যাচাই হচ্ছে..." : "যাচাই করুন ও নিবন্ধন করুন"}
        </button>
      </form>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-gray-600 transition">
          ← পিছনে যান
        </button>
        <button type="button" onClick={handleResend} disabled={countdown > 0}
          className={`font-medium transition ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-emerald-600 hover:underline"}`}>
          {countdown > 0 ? `পুনরায় পাঠান (${countdown}s)` : "OTP আবার পাঠান"}
        </button>
      </div>
    </div>
  );
}