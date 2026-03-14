import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function RequestHelp() {

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.fullName || !form.phone || !form.address || !form.description) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);

    try {

      await api.post("/help-requests", form);

      toast.success("আপনার আবেদন আমাদের কাছে পৌঁছেছে");

      setForm({
        fullName: "",
        phone: "",
        address: "",
        description: "",
      });

    } catch {
      toast.error("আবেদন পাঠাতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="max-w-3xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
        সাহায্যের আবেদন
      </h1>

      <p className="text-gray-500 mb-8">
        আপনার সমস্যার বিবরণ লিখুন। আমরা সাহায্য করার চেষ্টা করব।
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 space-y-5"
      >

        <div>
          <label className="text-sm font-semibold text-gray-700">
            পূর্ণ নাম
          </label>

          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            ফোন নম্বর
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            ঠিকানা
          </label>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            সমস্যার বিবরণ
          </label>

          <textarea
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "পাঠানো হচ্ছে..." : "আবেদন জমা দিন"}
        </button>

      </form>

    </div>

  );

}