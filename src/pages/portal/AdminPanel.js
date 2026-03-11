import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { UserPlus, UserX, Camera } from "lucide-react";
import memberLogo from "../../assets/member_logo.jpeg";

export default function AdminPanel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    monthlyDonation: "",
  });

  const fetchMembers = async () => {
    const { data } = await api.get("/auth/members");
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers().finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৫ MB এর বেশি হবে না");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!photoFile) {
      toast.error("সদস্যের ছবি আপলোড করা আবশ্যক!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("monthlyDonation", form.monthlyDonation || 0);
      formData.append("image", photoFile); // ← photo required

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("নতুন সদস্য যোগ করা হয়েছে!");
      setShowForm(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setForm({ name: "", email: "", password: "", role: "member", monthlyDonation: "" });
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`${name} কে সরিয়ে দেবেন?`)) return;
    try {
      await api.delete(`/auth/members/${id}`);
      toast.success("সদস্য নিষ্ক্রিয় করা হয়েছে");
      fetchMembers();
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-500 text-sm">সদস্য ব্যবস্থাপনা</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          <UserPlus size={18} /> নতুন সদস্য যোগ করুন
        </button>
      </div>

      {/* Add member form */}
      {showForm && (
        <form
          onSubmit={handleAddMember}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2 className="font-bold text-gray-800 text-lg mb-5">নতুন সদস্যের তথ্য</h2>

          {/* Photo upload — REQUIRED */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={photoPreview || memberLogo}
                alt="প্রোফাইল ছবি"
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-300 shadow"
              />
              <label
                htmlFor="member-photo"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition shadow"
              >
                <Camera size={16} />
              </label>
              <input
                id="member-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ছবি আপলোড করুন{" "}
              <span className="text-red-500 font-semibold">(আবশ্যক)</span>
            </p>
            {!photoFile && (
              <p className="text-xs text-amber-600 mt-1 bg-amber-50 px-3 py-1 rounded-full">
                ⚠️ সদস্য যোগ করতে ছবি আপলোড করতে হবে
              </p>
            )}
            {photoFile && (
              <p className="text-xs text-emerald-600 mt-1 bg-emerald-50 px-3 py-1 rounded-full">
                ✓ ছবি নির্বাচিত হয়েছে
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ইমেইল <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                মাসিক অনুদান (৳)
              </label>
              <input
                type="number"
                value={form.monthlyDonation}
                onChange={(e) => setForm({ ...form, monthlyDonation: e.target.value })}
                min="0"
                placeholder="যেমন: 500"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ভূমিকা
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={submitting || !photoFile}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {submitting ? "যোগ হচ্ছে..." : "সদস্য যোগ করুন"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      {/* Members table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">সদস্য</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ইমেইল</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ভূমিকা</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">মাসিক অনুদান</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">যোগদান</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.image || memberLogo}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        onError={(e) => { e.target.src = memberLogo; }}
                      />
                      <span className="font-medium text-gray-700">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        m.role === "admin"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {m.monthlyDonation ? `৳${m.monthlyDonation.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(m.joiningDate || m.createdAt).toLocaleDateString("bn-BD")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRemove(m._id, m.name)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition"
                    >
                      <UserX size={14} /> সরিয়ে দিন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
