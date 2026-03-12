import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Camera, UserPlus } from "lucide-react";
import memberLogo from "../../assets/member_logo.jpeg";
import logo from "../../assets/logo2.png";

export default function Register() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ সর্বোচ্চ ৫ MB হতে হবে");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoFile) {
      toast.error("প্রোফাইল ছবি আপলোড করা আবশ্যক");
      return;
    }
    if (!form.name || !form.fatherName || !form.email || !form.phone || !form.password) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }
    if (form.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("fatherName", form.fatherName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("image", photoFile);

      await api.post("/auth/register-request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("আবেদন সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "রেজিস্ট্রেশনে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">নতুন সদস্য নিবন্ধন</h1>
          <p className="text-gray-500 text-sm mt-1">
            আপনার তথ্য পূরণ করুন। অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-5"
        >
          {/* Photo Upload */}
          <div className="flex flex-col items-center pb-4 border-b">
            <div className="relative mb-2">
              <img
                src={photoPreview || memberLogo}
                alt="প্রোফাইল"
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-300 shadow"
              />
              <label
                htmlFor="reg-photo"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition shadow-md"
              >
                <Camera size={16} />
              </label>
              <input
                id="reg-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">
              প্রোফাইল ছবি আপলোড করুন{" "}
              <span className="text-red-500 font-semibold">(আবশ্যক)</span>
            </p>
            {photoFile ? (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-1">
                ✓ ছবি নির্বাচিত
              </span>
            ) : (
              <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-1">
                ⚠ ছবি নির্বাচন করুন
              </span>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              পিতার নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              placeholder="আপনার পিতার নাম লিখুন"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ফোন / WhatsApp নম্বর <span className="text-red-500">*</span>
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

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="কমপক্ষে ৬ অক্ষর"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="পাসওয়ার্ড আবার লিখুন"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                form.confirmPassword && form.password !== form.confirmPassword
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300"
              }`}
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !photoFile}
            className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
          >
            {loading ? (
              "জমা হচ্ছে..."
            ) : (
              <>
                <UserPlus size={18} /> নিবন্ধন করুন
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            ইতোমধ্যে সদস্য?{" "}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              লগইন করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
