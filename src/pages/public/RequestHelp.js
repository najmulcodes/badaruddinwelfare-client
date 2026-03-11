import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Send, AlertCircle } from "lucide-react";

export default function RequestHelp() {
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", description: "" });
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
      toast.success("আবেদন সফলভাবে জমা হয়েছে!");
    } catch (error) {
      toast.error(error.response?.data?.message || "আবেদন জমা দিতে সমস্যা হয়েছে");
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">আবেদন জমা হয়েছে!</h2>
          <p className="text-gray-500 mb-6">
            আপনার আবেদন আমাদের কাছে পৌঁছেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: "", phone: "", address: "", description: "" }); }}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            নতুন আবেদন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">সাহায্যের আবেদন</h1>
        <p className="text-gray-500">আপনার সমস্যার বিবরণ জানান। আমরা যথাসাধ্য সহায়তা করার চেষ্টা করব।</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-8">
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-sm">
          এটি একটি সাহায্যের আবেদন ফর্ম। আর্থিক লেনদেনের জন্য নয়। আপনার আবেদন আমাদের সদস্যরা পর্যালোচনা করবেন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">পূর্ণ নাম *</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">মোবাইল নম্বর *</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">ঠিকানা *</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">সমস্যার বিবরণ *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="আপনার সমস্যা বা প্রয়োজনীয়তার বিস্তারিত বিবরণ লিখুন..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">সংযুক্তি (ঐচ্ছিক)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium hover:file:bg-emerald-100"
          />
          <p className="text-xs text-gray-400 mt-1">সর্বোচ্চ ৫ MB। ছবি বা PDF ফাইল।</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? "জমা হচ্ছে..." : (<><Send size={18} /> আবেদন জমা দিন</>)}
        </button>
      </form>
    </div>
  );
}
