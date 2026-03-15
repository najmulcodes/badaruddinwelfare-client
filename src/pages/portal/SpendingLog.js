import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

export default function SpendingLog() {
  const { isAdmin } = useAuth();
  const [spendings, setSpendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ recipientName: "", amount: "", purpose: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const fetchSpendings = async () => {
    try {
      const { data } = await api.get("/spending");
      setSpendings(data);
    } catch { toast.error("ডেটা লোড করতে সমস্যা হয়েছে"); }
  };

  useEffect(() => {
    fetchSpendings().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/spending", form);
      toast.success("ব্যয় এন্ট্রি যোগ করা হয়েছে!");
      setShowForm(false);
      setForm({ recipientName: "", amount: "", purpose: "", date: new Date().toISOString().split("T")[0], notes: "" });
      fetchSpendings();
    } catch (err) { toast.error(err.response?.data?.message || "সমস্যা হয়েছে"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই এন্ট্রি মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/spending/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      fetchSpendings();
    } catch { toast.error("মুছতে সমস্যা হয়েছে"); }
  };

  if (loading) return <PageLoader />;

  const total = spendings.reduce((s, sp) => s + sp.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">তহবিল ব্যয়ের তালিকা</h1>
          <p className="text-gray-500 text-sm">যাদের সহায়তা করা হয়েছে তার তালিকা</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <Plus size={18} /> নতুন ব্যয়
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">গ্রহণকারীর নাম *</label>
            <input type="text" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (৳) *</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} min="1" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">উদ্দেশ্য *</label>
            <input type="text" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="যেমন: চিকিৎসা সহায়তা" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">নোট</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ঐচ্ছিক" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">সংরক্ষণ করুন</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">বাতিল</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-end">
        <span className="text-sm font-bold text-red-500">মোট ব্যয়: ৳{total.toLocaleString("en-IN")}</span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">গ্রহণকারী</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">উদ্দেশ্য</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">পরিমাণ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">তারিখ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">নোট</th>
                {isAdmin && <th className="text-left px-4 py-3 font-semibold text-gray-600">অ্যাকশন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {spendings.length ? spendings.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{s.recipientName}</td>
                  <td className="px-4 py-3 text-gray-500">{s.purpose}</td>
                  <td className="px-4 py-3 font-bold text-red-500">৳{s.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(s.date).toLocaleDateString("bn-BD")}</td>
                  <td className="px-4 py-3 text-gray-400">{s.notes || "—"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-10 text-gray-400">কোনো ব্যয় পাওয়া যায়নি</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
