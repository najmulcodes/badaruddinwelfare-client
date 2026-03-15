import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Camera, ShieldCheck, UserCheck, UserPlus, UserX } from "lucide-react";
import memberLogo from "../../assets/member_logo.jpeg";
import { useAuth } from "../../context/AuthContext";

const SUPER_ADMIN = "admin@shariar.com";

function getRoleMeta(member) {
  const isSuperAdmin = member?.role === "superAdmin" || member?.email === SUPER_ADMIN;
  if (isSuperAdmin) {
    return { label: "Creator", cls: "bg-purple-100 text-purple-700", isSuperAdmin: true };
  }
  if (member?.role === "admin") {
    return { label: "Admin", cls: "bg-yellow-100 text-yellow-700", isSuperAdmin: false };
  }
  return { label: "Member", cls: "bg-emerald-100 text-emerald-700", isSuperAdmin: false };
}

export default function AdminPanel() {
  const { isSuperAdmin: currentUserIsSuperAdmin } = useAuth();

  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("members");
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    monthlyDonation: "",
  });

  const fetchAll = async () => {
    const [membersRes, pendingRes] = await Promise.all([api.get("/auth/members"), api.get("/auth/pending")]);
    setMembers(membersRes.data);
    setPending(pendingRes.data);
  };

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবি ৫ MB এর বেশি হবে না");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      toast.error("সদস্যের ছবি আপলোড করা আবশ্যক");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      fd.append("image", photoFile);
      await api.post("/auth/register", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("নতুন সদস্য যোগ করা হয়েছে");
      setShowForm(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setForm({
        name: "",
        fatherName: "",
        email: "",
        phone: "",
        password: "",
        role: "member",
        monthlyDonation: "",
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/auth/approve/${id}`);
      toast.success("সদস্য অনুমোদন করা হয়েছে");
      fetchAll();
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`${name} কে বাতিল করবেন?`)) return;
    try {
      await api.delete(`/auth/reject/${id}`);
      toast.success("সদস্য বাতিল করা হয়েছে");
      fetchAll();
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`${name} কে সরিয়ে দেবেন?`)) return;
    try {
      await api.delete(`/auth/members/${id}`);
      toast.success("সদস্য নিষ্ক্রিয় করা হয়েছে");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">অ্যাডমিন প্যানেল</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">সদস্য ব্যবস্থাপনা</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
          >
            <UserPlus size={18} /> নতুন সদস্য যোগ
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddMember} className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-5 text-lg font-bold text-gray-800 dark:text-gray-100">নতুন সদস্যের তথ্য</h2>

          <div className="mb-5 flex flex-col items-center">
            <div className="relative">
              <img
                src={photoPreview || memberLogo}
                alt="প্রোফাইল"
                className="h-24 w-24 rounded-full border-4 border-emerald-300 object-cover shadow"
              />
              <label
                htmlFor="ap-photo"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-emerald-600 p-1.5 text-white shadow hover:bg-emerald-700"
              >
                <Camera size={14} />
              </label>
              <input id="ap-photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            {photoFile ? (
              <span className="mt-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                ছবি নির্বাচিত
              </span>
            ) : (
              <span className="mt-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                ছবি আবশ্যক
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "পূর্ণ নাম", key: "name", type: "text", placeholder: "পূর্ণ নাম", required: true },
              { label: "পিতার নাম", key: "fatherName", type: "text", placeholder: "পিতার নাম", required: true },
              { label: "ইমেইল", key: "email", type: "email", placeholder: "example@email.com", required: true },
              { label: "ফোন / WhatsApp", key: "phone", type: "tel", placeholder: "01XXXXXXXXX", required: true },
              { label: "পাসওয়ার্ড", key: "password", type: "password", placeholder: "কমপক্ষে ৬ অক্ষর", required: true },
              { label: "মাসিক অনুদান (৳)", key: "monthlyDonation", type: "number", placeholder: "500", required: false },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  required={required}
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">ভূমিকা</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                {currentUserIsSuperAdmin && <option value="superAdmin">Super Admin</option>}
              </select>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={submitting || !photoFile}
              className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
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
              className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("members")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
            tab === "members"
              ? "bg-emerald-600 text-white"
              : "border bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          সক্রিয় সদস্য ({members.length})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
            tab === "pending"
              ? "bg-amber-500 text-white"
              : "border bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          অনুমোদন বাকি{" "}
          {pending.length > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{pending.length}</span>
          )}
        </button>
      </div>

      {tab === "members" && (
        <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {["সদস্য", "পিতার নাম", "ইমেইল", "ফোন", "ভূমিকা", "মাসিক অনুদান", "অ্যাকশন"].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {members.map((member) => {
                  const roleMeta = getRoleMeta(member);
                  return (
                    <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <img
                              src={member.image || memberLogo}
                              alt={member.name}
                              className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                              onError={(e) => {
                                e.target.src = memberLogo;
                              }}
                            />
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${roleMeta.cls}`}>
                              {roleMeta.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="whitespace-nowrap font-medium text-gray-700 dark:text-gray-200">{member.name}</span>
                            {roleMeta.isSuperAdmin && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-xs font-semibold text-purple-700">
                                <ShieldCheck size={10} /> Creator
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">{member.fatherName || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{member.email}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">{member.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleMeta.cls}`}>{roleMeta.label}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                        {member.monthlyDonation ? `৳${member.monthlyDonation.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {roleMeta.isSuperAdmin ? (
                          <span className="text-xs italic text-gray-400 dark:text-gray-500">সুরক্ষিত</span>
                        ) : (
                          <button
                            onClick={() => handleRemove(member._id, member.name)}
                            className="flex items-center gap-1 text-xs font-medium text-red-500 transition hover:text-red-700"
                          >
                            <UserX size={14} /> সরিয়ে দিন
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "pending" && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm dark:bg-gray-800 dark:text-gray-500">
              কোনো অনুমোদন বাকি নেই
            </div>
          ) : (
            pending.map((member) => (
              <div
                key={member._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.image || memberLogo}
                    alt={member.name}
                    className="h-14 w-14 rounded-full border-2 border-amber-300 object-cover"
                    onError={(e) => {
                      e.target.src = memberLogo;
                    }}
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">পিতা: {member.fatherName || "—"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email} · {member.phone}</p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                      আবেদন: {new Date(member.createdAt).toLocaleDateString("bn-BD")}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    onClick={() => handleApprove(member._id)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <UserCheck size={16} /> অনুমোদন করুন
                  </button>
                  <button
                    onClick={() => handleReject(member._id, member.name)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    <UserX size={16} /> বাতিল
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
