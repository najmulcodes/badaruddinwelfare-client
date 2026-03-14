import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2, Filter, Send } from "lucide-react";

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const currentYear = new Date().getFullYear();

// ─── Member self-report form ───
function MemberDonationForm({ user, onSuccess }) {
  const [form, setForm] = useState({
    amount: "",
    method: "bKash",
    bankName: "",
    bkashNumber: "",
    personName: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) return toast.error("পরিমাণ লিখুন");
    if (form.method === "Bank" && !form.bankName) return toast.error("ব্যাংকের নাম লিখুন");
    if (form.method === "bKash" && !form.bkashNumber) return toast.error("bKash নম্বর লিখুন");
    if (form.method === "Person" && !form.personName) return toast.error("ব্যক্তির নাম লিখুন");

    let methodDetail = "";
    if (form.method === "Bank") methodDetail = `ব্যাংক: ${form.bankName}`;
    else if (form.method === "bKash") methodDetail = `bKash: ${form.bkashNumber}`;
    else if (form.method === "Person") methodDetail = `ব্যক্তি: ${form.personName}`;

    const notes = `${form.method} | ${methodDetail}${form.notes ? ` | ${form.notes}` : ""}`;

    setLoading(true);
    try {
      await api.post("/donations/member-report", {
        amount: form.amount,
        month: form.month,
        year: form.year,
        notes,
      });
      toast.success("অনুদানের তথ্য পাঠানো হয়েছে! অ্যাডমিন যাচাই করবেন।");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-emerald-500">
      <h2 className="font-bold text-gray-800 text-lg mb-1">অনুদান পাঠানোর তথ্য জমা দিন</h2>
      <p className="text-xs text-gray-400 mb-5">আপনি অনুদান পাঠালে এখানে বিস্তারিত জানান। অ্যাডমিন যাচাই করে রেকর্ড করবেন।</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (৳) <span className="text-red-500">*</span></label>
          <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})}
            min="1" placeholder="যেমন: 500"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">পাঠানোর মাধ্যম <span className="text-red-500">*</span></label>
          <select value={form.method} onChange={(e) => setForm({...form, method: e.target.value, bankName: "", bkashNumber: "", personName: ""})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="bKash">bKash</option>
            <option value="Bank">ব্যাংক</option>
            <option value="Person">সরাসরি ব্যক্তি</option>
          </select>
        </div>

        {form.method === "Bank" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">ব্যাংকের নাম <span className="text-red-500">*</span></label>
            <input type="text" value={form.bankName} onChange={(e) => setForm({...form, bankName: e.target.value})}
              placeholder="যেমন: Dutch Bangla Bank"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        )}
        {form.method === "bKash" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">bKash নম্বর <span className="text-red-500">*</span></label>
            <input type="tel" value={form.bkashNumber} onChange={(e) => setForm({...form, bkashNumber: e.target.value})}
              placeholder="01XXXXXXXXX"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        )}
        {form.method === "Person" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">যার কাছে দিয়েছেন <span className="text-red-500">*</span></label>
            <input type="text" value={form.personName} onChange={(e) => setForm({...form, personName: e.target.value})}
              placeholder="ব্যক্তির নাম"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">মাস</label>
          <select value={form.month} onChange={(e) => setForm({...form, month: Number(e.target.value)})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">বছর</label>
          <input type="number" value={form.year} onChange={(e) => setForm({...form, year: Number(e.target.value)})}
            min="2023" max="2030"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">অতিরিক্ত নোট (ঐচ্ছিক)</label>
          <input type="text" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})}
            placeholder="কোনো বিশেষ তথ্য থাকলে লিখুন"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
          <Send size={16} /> {loading ? "পাঠানো হচ্ছে..." : "তথ্য পাঠান"}
        </button>
      </div>
    </form>
  );
}

export default function DonationLog() {
  const { isAdmin, user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [form, setForm] = useState({ member: "", memberName: "", amount: "", month: new Date().getMonth() + 1, year: currentYear, notes: "" });

  const fetchDonations = async (currentFilter = filter) => {
    try {
      const params = {};
      if (currentFilter.month) params.month = currentFilter.month;
      if (currentFilter.year) params.year = currentFilter.year;
      const { data } = await api.get("/donations", { params });
      setDonations(data);
    } catch { toast.error("ডেটা লোড করতে সমস্যা হয়েছে"); }
  };

  useEffect(() => {
    const init = async () => {
      await fetchDonations(filter);
      if (isAdmin) {
        const { data } = await api.get("/auth/members");
        setMembers(data);
      }
      setLoading(false);
    };
    init();
  }, [isAdmin]);

  useEffect(() => { fetchDonations(filter); }, [filter]);

  const handleMemberSelect = (e) => {
    const m = members.find((m) => m._id === e.target.value);
    setForm({ ...form, member: m?._id || "", memberName: m?.name || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/donations", form);
      toast.success("অনুদান যোগ করা হয়েছে!");
      setShowForm(false);
      setForm({ member: "", memberName: "", amount: "", month: new Date().getMonth() + 1, year: currentYear, notes: "" });
      fetchDonations(filter);
    } catch (err) { toast.error(err.response?.data?.message || "সমস্যা হয়েছে"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই অনুদান এন্ট্রি মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      fetchDonations(filter);
    } catch { toast.error("মুছতে সমস্যা হয়েছে"); }
  };

  if (loading) return <PageLoader />;

  const total = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">অনুদান লগ</h1>
          <p className="text-gray-500 text-sm">সদস্যদের মাসিক অনুদানের তালিকা</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isAdmin && (
            <button onClick={() => setShowMemberForm(!showMemberForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
              <Send size={18} /> অনুদান পাঠিয়েছি
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
              <Plus size={18} /> নতুন অনুদান
            </button>
          )}
        </div>
      </div>

      {!isAdmin && showMemberForm && (
        <MemberDonationForm user={user} onSuccess={() => { setShowMemberForm(false); fetchDonations(); }} />
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">সদস্য *</label>
            <select onChange={handleMemberSelect} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required>
              <option value="">সদস্য বেছে নিন</option>
              {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (৳) *</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} min="1"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মাস *</label>
            <select value={form.month} onChange={(e) => setForm({...form, month: Number(e.target.value)})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বছর *</label>
            <input type="number" value={form.year} onChange={(e) => setForm({...form, year: Number(e.target.value)})} min="2023" max="2030"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">নোট</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ঐচ্ছিক" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">সংরক্ষণ করুন</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">বাতিল</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex gap-4 flex-wrap items-center">
        <Filter size={16} className="text-gray-400" />
        <select value={filter.month} onChange={(e) => setFilter({...filter, month: e.target.value})}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">সব মাস</option>
          {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={filter.year} onChange={(e) => setFilter({...filter, year: e.target.value})}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">সব বছর</option>
          {[2023,2024,2025,2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span className="ml-auto text-sm font-bold text-emerald-600">মোট: ৳{total.toLocaleString("en-IN")}</span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">সদস্যের নাম</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">মাস / বছর</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">পরিমাণ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">নোট</th>
                {isAdmin && <th className="text-left px-4 py-3 font-semibold text-gray-600">অ্যাকশন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.length ? donations.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{d.memberName}</td>
                  <td className="px-4 py-3 text-gray-500">{MONTHS[d.month - 1]} {d.year}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">৳{d.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{d.notes || "—"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:text-red-700 transition"><Trash2 size={16} /></button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={isAdmin ? 5 : 4} className="text-center py-10 text-gray-400">কোনো অনুদান পাওয়া যায়নি</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}