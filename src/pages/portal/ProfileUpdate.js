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
      toast.success("তথ্য আপডেট হয়েছে");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">প্রোফাইল বদলান</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">আপনার তথ্য আর ছবি বদলাতে পারেন</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800 sm:p-8">
          <div className="flex flex-col items-center border-b border-gray-200 pb-5 dark:border-gray-700">
            <div className="relative mb-2">
              <img
                src={photoPreview || user?.image || memberLogo}
                alt="প্রোফাইল"
                className="h-24 w-24 rounded-full border-4 border-emerald-300 object-cover shadow sm:h-28 sm:w-28"
                onError={(e) => {
                  e.target.src = memberLogo;
                }}
              />
              <label
                htmlFor="profile-photo"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-emerald-600 p-2 text-white shadow-md transition hover:bg-emerald-700"
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
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              {photoFile ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                  নতুন ছবি নেওয়া হয়েছে
                </span>
              ) : (
                "ছবি বদলাতে এখানে চাপুন"
              )}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              বাবার নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              placeholder="আপনার বাবার নাম"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ফোন / WhatsApp নম্বর <span className="text-red-500">*</span>
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

          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
              পাসওয়ার্ড বদলাতে চাইলে নিচে লিখুন, না চাইলে ফাঁকা রাখুন
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  পাসওয়ার্ড আবার লিখুন
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                  } dark:text-gray-100`}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">পাসওয়ার্ড মিলছে না</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
          >
            {loading ? "সংরক্ষণ হচ্ছে..." : <><Save size={18} /> প্রোফাইল সংরক্ষণ করুন</>}
          </button>
        </form>
      </div>
    </div>
  );
}
