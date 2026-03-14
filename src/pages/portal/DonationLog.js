import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Filter } from "lucide-react";

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const currentYear = new Date().getFullYear();

export default function DonationLog() {
  const { isAdmin } = useAuth();
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [form, setForm] = useState({ member: "", memberName: "", amount: "", month: new Date().getMonth() + 1, year: currentYear, notes: "" });

  const fetchDonations = async () => {
    try {
      const { data } = await api.get("/donations");
      setDonations(data);
    } catch {
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (

    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">অনুদান লগ</h1>
          <p className="text-gray-500 text-sm">সদস্যদের মাসিক অনুদানের তালিকা</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            <Plus size={18} /> নতুন অনুদান
          </button>
        )}
      </div>

      {/* Add form */}
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
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} min="1" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মাস *</label>
            <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বছর *</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} min="2023" max="2030" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">নোট</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ঐচ্ছিক" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">সংরক্ষণ করুন</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">বাতিল</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex gap-4 flex-wrap items-center">
        <Filter size={16} className="text-gray-400" />
        <select value={filter.month} onChange={(e) => setFilter({ ...filter, month: e.target.value })} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">সব মাস</option>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={filter.year} onChange={(e) => setFilter({ ...filter, year: e.target.value })} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">সব বছর</option>
          {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span className="ml-auto text-sm font-bold text-emerald-600">মোট: ৳{total.toLocaleString("en-IN")}</span>
      </div>

      {/* Table */}
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
                  <td className="px-4 py-3 text-gray-400">{d.notes || "—"}</td>
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