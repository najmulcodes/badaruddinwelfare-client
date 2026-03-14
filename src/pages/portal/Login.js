import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);

    try {

      const { data } = await api.post("/auth/login", form);

      login(data);

      toast.success("লগইন সফল হয়েছে");

      navigate("/portal/dashboard");

    } catch {
      toast.error("ইমেইল অথবা পাসওয়ার্ড ভুল");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="max-w-md mx-auto px-4 py-12">

      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        সদস্য লগইন
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 space-y-5"
      >

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

          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}

        </button>

      </form>

    </div>

  );

}