import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন");
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("বার্তা পাঠানো হয়েছে!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("বার্তা পাঠাতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">যোগাযোগ করুন</h1>
        <p className="text-gray-500 max-w-xl mx-auto">আমাদের সাথে যোগাযোগ করুন বা আপনার মতামত জানান।</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-emerald-700 mb-5">যোগাযোগের তথ্য</h2>
            <div className="space-y-4">
              {[
                { icon: <MapPin size={20} />, text: "রেলগেইট, ফাজিলপুর বাজার সংলগ্ন, ফেনী, বাংলাদেশ" },
                { icon: <Phone size={20} />, text: "+880 1840 242 448" },
                { icon: <Mail size={20} />, text: "badaruddinwelfareorg@gmail.com" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-600">
                  <span className="text-emerald-500 mt-0.5">{icon}</span>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-700 mb-2">কার্যালয়ের সময়</h3>
            <p className="text-sm text-gray-600">শনিবার – বৃহস্পতিবার</p>
            <p className="text-sm text-gray-600">সকাল ৯টা – বিকাল ৫টা</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5">
          <h2 className="text-xl font-bold text-emerald-700">বার্তা পাঠান</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বার্তা</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "পাঠানো হচ্ছে..." : (<><Send size={18} /> বার্তা পাঠান</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
