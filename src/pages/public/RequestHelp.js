import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { AlertCircle, Send } from "lucide-react";

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
      toast.success("আবেদন পাঠানো হয়েছে");
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
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800 sm:p-10">
          <div className="mb-4 flex justify-center text-emerald-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Send size={36} />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-100">আবেদন পাঠানো হয়েছে</h2>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            আপনার আবেদন আমরা পেয়েছি। সময় হলে আপনার সঙ্গে যোগাযোগ করা হবে।
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ fullName: "", phone: "", address: "", description: "" });
              setAttachment(null);
            }}
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            আবার আবেদন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-4xl">সাহায্যের আবেদন</h1>
        <p className="text-gray-500 dark:text-gray-400">আপনার সমস্যাটা লিখুন। আমরা যতটা পারি সাহায্য করার চেষ্টা করব।</p>
      </div>

      <div className="mb-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          এটা সাহায্য চাওয়ার ফর্ম। আবেদনটি আমাদের টিম দেখে পরে জানাবে।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            পূর্ণ নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="আপনার পূর্ণ নাম লিখুন"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            মোবাইল নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            ঠিকানা <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="গ্রাম, উপজেলা, জেলা"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            কী সমস্যা <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="আপনার সমস্যাটা একটু লিখুন..."
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            ছবি বা কাগজ (ইচ্ছা হলে)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-300"
          />
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">সর্বোচ্চ ৫ MB। ছবি বা PDF দিতে পারেন।</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "পাঠানো হচ্ছে..." : <><Send size={18} /> আবেদন পাঠান</>}
        </button>
      </form>
    </div>
  );
}
