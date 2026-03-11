import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-9xl font-extrabold text-emerald-200">404</p>
      <h1 className="text-3xl font-bold text-gray-800 mt-4">পেজটি পাওয়া যায়নি!</h1>
      <p className="text-gray-500 mt-2 mb-8">আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই।</p>
      <Link to="/" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
        হোমে ফিরে যান
      </Link>
    </div>
  );
}
