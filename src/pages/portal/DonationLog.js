import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Check, Filter, Plus, Send, Trash2, X } from "lucide-react";

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

const STATUS_BADGES = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

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
      className="mb-6 rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-md dark:bg-gray-800 sm:p-6"
    >
      <h2 className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-100">অনুদানের তথ্য দিন</h2>
      <p className="mb-5 text-xs text-gray-400 dark:text-gray-500">
        অনুদানের তথ্য পাঠালে অ্যাডমিন দেখে স্ট্যাটাস দেবেন।
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            পরিমাণ (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="1"
            placeholder="যেমন: 500"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="bKash">bKash</option>
            <option value="Bank">ব্যাংক</option>
            <option value="Person">সরাসরি ব্যক্তি</option>
          </select>
        </div>

        {form.method === "Bank" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ব্যাংকের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="যেমন: Dutch Bangla Bank"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {form.method === "bKash" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              bKash নম্বর <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.bkashNumber}
              onChange={(e) => setForm({ ...form, bkashNumber: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {form.method === "Person" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              যাকে দিয়েছেন <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.personName}
              onChange={(e) => setForm({ ...form, personName: e.target.value })}
              placeholder="ব্যক্তির নাম"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">মাস</label>
          <select
            value={form.month}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">বছর</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            min={MIN_YEAR}
            max="2030"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            কিছু লিখতে চাইলে
          </label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="অতিরিক্ত কিছু লিখতে পারেন"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
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
  const [filter, setFilter] = useState({ month: "", year: "", status: "" });
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
      if (isAdmin && filter.status) params.status = filter.status;

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
  }, [isAdmin]);

  useEffect(() => {
    fetchDonations();
  }, [filter, isAdmin]);

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

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/donations/${status}/${id}`);
      toast.success("স্ট্যাটাস পরিবর্তন হয়েছে");
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const filterYears = Array.from(
    { length: currentYear - MIN_YEAR + 1 },
    (_, index) => MIN_YEAR + index
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">অনুদানের তালিকা</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">সদস্যদের মাসভিত্তিক অনুদানের তালিকা</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {!isAdmin && (
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              <Send size={18} /> অনুদানের তথ্য দিন
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
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
          className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-md dark:bg-gray-800 sm:grid-cols-2 sm:p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">সদস্য *</label>
            <select
              onChange={handleMemberSelect}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">পরিমাণ (৳) *</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              min="1"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">মাস *</label>
            <select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">বছর *</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              min={MIN_YEAR}
              max="2030"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">নোট</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="ইচ্ছা হলে লিখুন"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              সংরক্ষণ করুন
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:w-auto"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <Filter size={16} className="shrink-0 text-gray-400 dark:text-gray-500" />
        <select
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:w-auto"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:w-auto"
        >
          <option value="">সব বছর</option>
          {filterYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {isAdmin && (
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:w-auto"
          >
            <option value="">সব স্ট্যাটাস</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
        <span className="w-full text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:ml-auto sm:w-auto">
          মোট: ৳{total.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">সদস্যের নাম</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">মাস / বছর</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">পরিমাণ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">নোট</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">অ্যাকশন</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {donations.length ? (
                donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{donation.memberName}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {MONTHS[donation.month - 1]} {donation.year}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{donation.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          STATUS_BADGES[donation.status] || STATUS_BADGES.pending
                        }`}
                      >
                        {donation.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">{donation.notes || "—"}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {donation.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(donation._id, "approve")}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(donation._id, "reject")}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(donation._id)}
                            className="text-red-500 transition hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-10 text-center text-gray-400 dark:text-gray-500">
                    কোনো অনুদান পাওয়া যায়নি
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
