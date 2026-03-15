import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function NotFound() {
  const [count, setCount] = useState(20);

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) {
      window.location.href = "/";
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">

        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-20 object-contain mx-auto mb-8 opacity-80"
        />

        {/* 404 number */}
        <div className="relative mb-6">
          <p className="text-[10rem] font-black text-emerald-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-2">😕</p>
              <p className="text-xl font-bold text-gray-700">পৃষ্ঠাটি পাওয়া যায়নি</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
          অথবা এটি কখনো ছিল না।
        </p>

        {/* Countdown */}
        <p className="text-sm text-gray-400 mb-6">
          <span className="font-bold text-emerald-600">{count}</span> সেকেন্ডে হোমে ফিরে যাবে
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            🏠 হোমে ফিরে যান
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl transition border border-gray-200 flex items-center justify-center gap-2"
          >
            ← আগের পৃষ্ঠা
          </button>
        </div>

      </div>
    </div>
  );
}
