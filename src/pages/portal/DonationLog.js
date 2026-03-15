import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2, Filter, Send } from "lucide-react";

const MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const currentYear = new Date().getFullYear();
const MIN_YEAR = 2020;

function MemberDonationForm({ onSuccess }) {
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
      toast.success("অনুদান যোগ হয়েছে");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6 border-l-4 border-emerald-500"
    >
      <h2 className="font-bold text-gray-800 text-lg mb-1">অনুদানের তথ্য দিন</h2>
      <p className="text-xs text-gray-400 mb-5">অনুদান পাঠিয়ে থাকলে এখানে লিখুন।</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            পরিমাণ (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="1"
            placeholder="যেমন: 500"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            কীভাবে পাঠিয়েছেন <span className="text-red-500">*</span>
          </label>
          <select
            value={form.method}
            onChange={(e) =>
              setForm({
                ...form,
                method: e.target.value,
                bankName: "",
                bkashNumber: "",
                personName: "",
              })
            }
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="bKash">bKash</option>
            <option value="Bank">ব্যাংক</option>
            <option value="Person">সরাসরি ব্যক্তি</option>
          </select>
        </div>

        {form.method === "Bank" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ব্যাংকের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="যেমন: Dutch Bangla Bank"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {form.method === "bKash" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              bKash নম্বর <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.bkashNumber}
              onChange={(e) => setForm({ ...form, bkashNumber: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {form.method === "Person" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              যাকে দিয়েছেন <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.personName}
              onChange={(e) => setForm({ ...form, personName: e.target.value })}
              placeholder="ব্যক্তির নাম"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">মাস</label>
          <select
            value={form.month}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">বছর</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            min={MIN_YEAR}
            max="2030"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">কিছু লিখতে চাইলে</label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="অতিরিক্ত কিছু লিখতে পারেন"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <Send size={16} /> {loading ? "পাঠানো হচ্ছে..." : "তথ্য পাঠান"}
        </button>
      </div>
    </form>
  );
}

export default function DonationLog() {
  const { isAdmin } = useAuth();
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [form, setForm] = useState({
    member: "",
    memberName: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    notes: "",
  });

  const fetchDonations = async () => {
    try {
      const params = {};
      if (filter.month) params.month = filter.month;
      if (filter.year) params.year = filter.year;
      const { data } = await api.get("/donations", { params });
      setDonations(data);
    } catch {
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    }
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

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const handleMemberSelect = (e) => {
    const member = members.find((item) => item._id === e.target.value);
    setForm({ ...form, member: member?._id || "", memberName: member?.name || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/donations", form);
      toast.success("অনুদান যোগ হয়েছে");
      setShowForm(false);
      setForm({
        member: "",
        memberName: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: currentYear,
        notes: "",
      });
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই অনুদান এন্ট্রি মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      fetchDonations();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const filterYears = Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">অনুদানের তালিকা</h1>
          <p className="text-gray-500 text-sm">সদস্যদের মাসভিত্তিক অনুদানের তালিকা</p>
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {!isAdmin && (
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              <Send size={18} /> অনুদানের তথ্য দিন
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              <Plus size={18} /> অনুদান যোগ করুন
            </button>
          )}
        </div>
      </div>

      {!isAdmin && showMemberForm && (
        <MemberDonationForm
          onSuccess={() => {
            setShowMemberForm(false);
            fetchDonations();
          }}
        />
      )}

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">সদস্য *</label>
            <select
              onChange={handleMemberSelect}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">সদস্য বেছে নিন</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (৳) *</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              min="1"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মাস *</label>
            <select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বছর *</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              min={MIN_YEAR}
              max="2030"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">নোট</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="ইচ্ছা হলে লিখুন"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              সংরক্ষণ করুন
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex gap-3 flex-wrap items-center">
        <Filter size={16} className="text-gray-400 shrink-0" />
        <select
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">সব মাস</option>
          {MONTHS.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
          className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">সব বছর</option>
          {filterYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <span className="w-full sm:w-auto sm:ml-auto text-sm font-bold text-emerald-600">
          মোট: ৳{total.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
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
              {donations.length ? (
                donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{donation.memberName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {MONTHS[donation.month - 1]} {donation.year}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      ৳{donation.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{donation.notes || "—"}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(donation._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center py-10 text-gray-400">
                    কোনো অনুদান পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
