import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);

    try {

      await api.post("/auth/register", form);

      toast.success("নিবন্ধন সফল হয়েছে");

      navigate("/login");

    } catch {
      toast.error("নিবন্ধনে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="max-w-md mx-auto px-4 py-12">

      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        সদস্য নিবন্ধন
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 space-y-5"
      >

        <div>

          <label className="text-sm font-semibold text-gray-700">
            নাম
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-700">
            ইমেইল
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-700">
            পাসওয়ার্ড
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold"
        >

          {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}

        </button>

      </form>

    </div>

  );

}