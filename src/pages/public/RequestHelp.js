import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Send, AlertCircle } from "lucide-react";

export default function RequestHelp() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    description: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, address, description } = form;
    if (!fullName || !phone || !address || !description) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (attachment) formData.append("attachment", attachment);

      await api.post("/help-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      toast.success("আবেদন পাঠানো হয়েছে!");
    } catch (error) {
      const msg = error.response?.data?.message;
      if (!msg || msg.includes("সার্ভার") || msg.includes("সংযোগ")) {
        toast.error("সার্ভারের সঙ্গে সংযোগ হচ্ছে না। একটু পরে আবার চেষ্টা করুন।");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="text-emerald-500 flex justify-center mb-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <Send size={36} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">আবেদন পাঠানো হয়েছে!</h2>
          <p className="text-gray-500 mb-6">
            আপনার আবেদন আমরা পেয়েছি। সময় হলে আপনার সঙ্গে যোগাযোগ করা হবে।
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ fullName: "", phone: "", address: "", description: "" });
              setAttachment(null);
            }}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            আবার আবেদন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">সাহায্যের আবেদন</h1>
        <p className="text-gray-500">
          আপনার সমস্যাটা লিখুন। আমরা যতটা পারি সাহায্য করার চেষ্টা করব।
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-8">
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-sm">
          এটা সাহায্য চাওয়ার ফর্ম। আবেদনটি আমাদের টিম দেখে পরে জানাবে।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            পূর্ণ নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="আপনার পূর্ণ নাম লিখুন"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            মোবাইল নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ঠিকানা <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="গ্রাম, উপজেলা, জেলা"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            কী সমস্যা <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="আপনার সমস্যাটা একটু লিখুন..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ছবি বা কাগজ (ইচ্ছা হলে)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium hover:file:bg-emerald-100"
          />
          <p className="text-xs text-gray-400 mt-1">সর্বোচ্চ ৫ MB। ছবি বা PDF দিতে পারেন।</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            "পাঠানো হচ্ছে..."
          ) : (
            <>
              <Send size={18} /> আবেদন পাঠান
            </>
          )}
        </button>
      </form>
    </div>
  );
}
