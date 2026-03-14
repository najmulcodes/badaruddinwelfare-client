limport React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2, Filter, Send } from "lucide-react";

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const currentYear = new Date().getFullYear();

export default function DonationLog() {
  const { user, isAdmin } = useAuth();
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [submitting, setSubmitting] = useState(false);

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    member: "", memberName: "", amount: "",
    month: new Date().getMonth() + 1, year: currentYear, notes: ""
  });

  // Member donation submission state
  const [method, setMethod] = useState("bKash");
  const [memberForm, setMemberForm] = useState({
    amount: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    bankName: "",
    bkashNumber: "",
    personName: "",
    notes: "",
  });

  const fetchDonations = async () => {
    try {
      const params = {};
      if (filter.month) params.month = filter.month;
      if (filter.year) params.year = filter.year;
      const { data } = await api.get("/donations", { params });
      setDonations(data);
    } catch { toast.error("ডেটা লোড করতে সমস্যা হয়েছে"); }
  };

  useEffect(() => {
    const init = async () => {
      await fetchDonations();
      if (isAdmin) {
        const { data } = await api.get("/auth/members");
        setMembers(data);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => { fetchDonations(); }, [filter]);

  // Admin: select member
  const handleMemberSelect = (e) => {
    const m = members.find((m) => m._id === e.target.value);
    setAdminForm({ ...adminForm, member: m?._id || "", memberName: m?.name || "" });
  };

  // Admin: add donation
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/donations", adminForm);
      toast.success("অনুদান যোগ করা হয়েছে!");
      setShowAdminForm(false);
      setAdminForm({ member: "", memberName: "", amount: "", month: new Date().getMonth() + 1, year: currentYear, notes: "" });
      fetchDonations();
    } catch (err) { toast.error(err.response?.data?.message || "সমস্যা হয়েছে"); }
  };

  // Member: submit own donation info
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.amount) return toast.error("পরিমাণ লিখুন");
    if (method === "Bank" && !memberForm.bankName) return toast.error("ব্যাংকের নাম লিখুন");
    if (method === "bKash" && !memberForm.bkashNumber) return toast.error("bKash নম্বর লিখুন");
    if (method === "Person" && !memberForm.personName) return toast.error("ব্যক্তির নাম লিখুন");

    setSubmitting(true);
    try {
      // Build notes with method details
      let methodNote = "";
      if (method === "Bank") methodNote = `ব্যাংক: ${memberForm.bankName}`;
      else if (method === "bKash") methodNote = `bKash: ${memberForm.bkashNumber}`;
      else if (method === "Person") methodNote = `ব্যক্তি: ${memberForm.personName}`;

      const notes = `[${method}] ${methodNote}${memberForm.notes ? ` | ${memberForm.notes}` : ""}`;

      await api.post("/donations", {
        member: user._id,
        memberName: user.name,
        amount: memberForm.amount,
        month: memberForm.month,
        year: memberForm.year,
        notes,
      });

      toast.success("আপনার অনুদানের তথ্য জমা হয়েছে!");
      setShowMemberForm(false);
      setMemberForm({ amount: "", month: new Date().getMonth() + 1, year: currentYear, bankName: "", bkashNumber: "", personName: "", notes: "" });
      setMethod("bKash");
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই অনুদান এন্ট্রি মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      fetchDonations();
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
          {/* Member: submit own donation */}
          {!isAdmin && (
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Send size={16} /> অনুদান পাঠিয়েছি
            </button>
          )}
          {/* Admin: add donation entry */}
          {isAdmin && (
            <button
              onClick={() => setShowAdminForm(!showAdminForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              <Plus size={18} /> নতুন অনুদান
            </button>
          )}
        </div>
      </div>

      {/* ── Member donation submission form ── */}
      {showMemberForm && !isAdmin && (
        <form onSubmit={handleMemberSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="font-bold text-gray-800 text-lg mb-1">আপনার অনুদানের তথ্য জমা দিন</h2>
          <p className="text-gray-400 text-xs mb-5">অ্যাডমিন এটি দেখে রেকর্ড করবেন</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                পরিমাণ (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min="1"
                value={memberForm.amount}
                onChange={(e) => setMemberForm({ ...memberForm, amount: e.target.value })}
                placeholder="যেমন: 500"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">মাস</label>
              <select
                value={memberForm.month}
                onChange={(e) => setMemberForm({ ...memberForm, month: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">বছর</label>
              <input
                type="number" min="2023" max="2030"
                value={memberForm.year}
                onChange={(e) => setMemberForm({ ...memberForm, year: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পাঠানোর মাধ্যম</label>
              <select
                value={method}
                onChange={(e) => { setMethod(e.target.value); setMemberForm({ ...memberForm, bankName: "", bkashNumber: "", personName: "" }); }}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bKash">bKash</option>
                <option value="Bank">ব্যাংক</option>
                <option value="Person">ব্যক্তিগতভাবে</option>
              </select>
            </div>

            {/* Conditional field */}
            {method === "Bank" && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ব্যাংকের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={memberForm.bankName}
                  onChange={(e) => setMemberForm({ ...memberForm, bankName: e.target.value })}
                  placeholder="যেমন: Dutch-Bangla Bank"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {method === "bKash" && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  bKash নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={memberForm.bkashNumber}
                  onChange={(e) => setMemberForm({ ...memberForm, bkashNumber: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {method === "Person" && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  কাকে দিয়েছেন <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={memberForm.personName}
                  onChange={(e) => setMemberForm({ ...memberForm, personName: e.target.value })}
                  placeholder="যাকে হাতে দিয়েছেন তার নাম"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Extra notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">অতিরিক্ত নোট (ঐচ্ছিক)</label>
              <input
                type="text"
                value={memberForm.notes}
                onChange={(e) => setMemberForm({ ...memberForm, notes: e.target.value })}
                placeholder="যেকোনো অতিরিক্ত তথ্য"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
            </button>
            <button type="button" onClick={() => setShowMemberForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">বাতিল</button>
          </div>
        </form>
      )}

      {/* ── Admin add form ── */}
      {showAdminForm && isAdmin && (
        <form onSubmit={handleAdminSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">সদস্য *</label>
            <select onChange={handleMemberSelect} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required>
              <option value="">সদস্য বেছে নিন</option>
              {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (৳) *</label>
            <input type="number" value={adminForm.amount} onChange={(e) => setAdminForm({ ...adminForm, amount: e.target.value })} min="1" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মাস *</label>
            <select value={adminForm.month} onChange={(e) => setAdminForm({ ...adminForm, month: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বছর *</label>
            <input type="number" value={adminForm.year} onChange={(e) => setAdminForm({ ...adminForm, year: Number(e.target.value) })} min="2023" max="2030" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">নোট</label>
            <input type="text" value={adminForm.notes} onChange={(e) => setAdminForm({ ...adminForm, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ঐচ্ছিক" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">সংরক্ষণ করুন</button>
            <button type="button" onClick={() => setShowAdminForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">বাতিল</button>
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
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{d.notes || "—"}</td>
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