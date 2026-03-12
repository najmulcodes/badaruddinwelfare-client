import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { UserPlus, UserX, UserCheck, Camera } from "lucide-react";
import memberLogo from "../../assets/member_logo.jpeg";

export default function AdminPanel() {
  const [members, setMembers]   = useState([]);
  const [pending, setPending]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("members"); // "members" | "pending"
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", fatherName: "", email: "", phone: "", password: "", role: "member", monthlyDonation: "" });

  const fetchAll = async () => {
    const [m, p] = await Promise.all([api.get("/auth/members"), api.get("/auth/pending")]);
    setMembers(m.data);
    setPending(p.data);
  };

  useEffect(() => { fetchAll().finally(() => setLoading(false)); }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("ছবি ৫ MB এর বেশি হবে না"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!photoFile) { toast.error("সদস্যের ছবি আপলোড করা আবশ্যক!"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", photoFile);
      await api.post("/auth/register", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("নতুন সদস্য যোগ করা হয়েছে!");
      setShowForm(false); setPhotoFile(null); setPhotoPreview(null);
      setForm({ name: "", fatherName: "", email: "", phone: "", password: "", role: "member", monthlyDonation: "" });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "সমস্যা হয়েছে"); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id, name) => {
    try {
      await api.patch(`/auth/approve/${id}`);
      toast.success(`${name} অনুমোদন করা হয়েছে!`);
      fetchAll();
    } catch { toast.error("সমস্যা হয়েছে"); }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`${name} কে সরিয়ে দেবেন?`)) return;
    try {
      await api.delete(`/auth/members/${id}`);
      toast.success("সদস্য নিষ্ক্রিয় করা হয়েছে");
      fetchAll();
    } catch { toast.error("সমস্যা হয়েছে"); }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-500 text-sm">সদস্য ব্যবস্থাপনা</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          <UserPlus size={18} /> নতুন সদস্য যোগ
        </button>
      </div>

      {/* Add member form */}
      {showForm && (
        <form onSubmit={handleAddMember} className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-5">নতুন সদস্যের তথ্য</h2>

          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative">
              <img src={photoPreview || memberLogo} alt="প্রোফাইল"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-300 shadow" />
              <label htmlFor="ap-photo"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-emerald-700 shadow">
                <Camera size={14} />
              </label>
              <input id="ap-photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            {photoFile
              ? <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-2">✓ ছবি নির্বাচিত</span>
              : <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-2">⚠ ছবি আবশ্যক</span>
            }
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "পূর্ণ নাম", key: "name", type: "text", placeholder: "পূর্ণ নাম", required: true },
              { label: "পিতার নাম", key: "fatherName", type: "text", placeholder: "পিতার নাম", required: true },
              { label: "ইমেইল", key: "email", type: "email", placeholder: "example@email.com", required: true },
              { label: "ফোন / WhatsApp", key: "phone", type: "tel", placeholder: "01XXXXXXXXX", required: true },
              { label: "পাসওয়ার্ড", key: "password", type: "password", placeholder: "কমপক্ষে ৬ অক্ষর", required: true },
              { label: "মাসিক অনুদান (৳)", key: "monthlyDonation", type: "number", placeholder: "500", required: false },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input type={type} value={form[key]} placeholder={placeholder}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required={required} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ভূমিকা</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={submitting || !photoFile}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
              {submitting ? "যোগ হচ্ছে..." : "সদস্য যোগ করুন"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setPhotoFile(null); setPhotoPreview(null); }}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg">বাতিল</button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("members")}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${tab === "members" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
          সক্রিয় সদস্য ({members.length})
        </button>
        <button onClick={() => setTab("pending")}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${tab === "pending" ? "bg-amber-500 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
          অনুমোদন বাকি {pending.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
        </button>
      </div>

      {/* Active members table */}
      {tab === "members" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["সদস্য", "পিতার নাম", "ইমেইল", "ফোন", "ভূমিকা", "মাসিক অনুদান", "অ্যাকশন"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={m.image || memberLogo} alt={m.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          onError={(e) => { e.target.src = memberLogo; }} />
                        <span className="font-medium text-gray-700 whitespace-nowrap">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.fatherName || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{m.email}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${m.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>{m.role}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.monthlyDonation ? `৳${m.monthlyDonation.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleRemove(m._id, m.name)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium">
                        <UserX size={14} /> সরিয়ে দিন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending approvals */}
      {tab === "pending" && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">কোনো অনুমোদন বাকি নেই</div>
          ) : pending.map((m) => (
            <div key={m._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <img src={m.image || memberLogo} alt={m.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-300"
                  onError={(e) => { e.target.src = memberLogo; }} />
                <div>
                  <p className="font-bold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500">পিতা: {m.fatherName || "—"}</p>
                  <p className="text-xs text-gray-500">{m.email} · {m.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">আবেদন: {new Date(m.createdAt).toLocaleDateString("bn-BD")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(m._id, m.name)}
                  className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition">
                  <UserCheck size={16} /> অনুমোদন করুন
                </button>
                <button onClick={() => handleRemove(m._id, m.name)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-200 transition">
                  <UserX size={16} /> বাতিল
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
