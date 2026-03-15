import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Camera, Save } from "lucide-react";
import memberLogo from "../../assets/member_logo.jpeg";

export default function ProfileUpdate() {
  const { user } = useAuth();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    fatherName: user?.fatherName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ সর্বোচ্চ ৫ MB");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("fatherName", form.fatherName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (form.password) formData.append("password", form.password);
      if (photoFile) formData.append("image", photoFile);

      const { data } = await api.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();

      toast.success("তথ্য আপডেট হয়েছে");
    } catch (err) {
      toast.error(err.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">প্রোফাইল বদলান</h1>
        <p className="text-gray-500 text-sm mt-1">আপনার তথ্য আর ছবি বদলাতে পারেন</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-5">
          <div className="flex flex-col items-center pb-5 border-b">
            <div className="relative mb-2">
              <img
                src={photoPreview || user?.image || memberLogo}
                alt="প্রোফাইল"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-300 shadow"
                onError={(e) => {
                  e.target.src = memberLogo;
                }}
              />
              <label
                htmlFor="profile-photo"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition shadow-md"
              >
                <Camera size={16} />
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              {photoFile ? (
                <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  নতুন ছবি নেওয়া হয়েছে
                </span>
              ) : (
                "ছবি বদলাতে এখানে চাপুন"
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              বাবার নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              placeholder="আপনার বাবার নাম"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ইমেইল <span className="text-red-500">*</span>
            </label>
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

          <div className="border-t pt-4">
            <p className="text-xs text-gray-400 mb-3">
              পাসওয়ার্ড বদলাতে চাইলে নিচে লিখুন, না চাইলে ফাঁকা রাখুন
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  পাসওয়ার্ড আবার লিখুন
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">পাসওয়ার্ড মিলছে না</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
          >
            {loading ? "সংরক্ষণ হচ্ছে..." : (<><Save size={18} /> প্রোফাইল সংরক্ষণ করুন</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
