import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2, Filter, Send } from "lucide-react";

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const currentYear = new Date().getFullYear();

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

    if (!form.amount) return toast.error("অনুদানের পরিমাণ লিখুন");

    if (form.method === "Bank" && !form.bankName)
      return toast.error("কোন ব্যাংক থেকে পাঠিয়েছেন লিখুন");

    if (form.method === "bKash" && !form.bkashNumber)
      return toast.error("যে bKash নম্বর থেকে পাঠিয়েছেন তা লিখুন");

    if (form.method === "Person" && !form.personName)
      return toast.error("যার হাতে দিয়েছেন তার নাম লিখুন");

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

      toast.success("ধন্যবাদ! আপনার অনুদানের তথ্য পাঠানো হয়েছে। যাচাই করে যোগ করা হবে।");
      onSuccess();

    } catch (err) {

      toast.error(err.response?.data?.message || "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-emerald-500">

      <h2 className="font-bold text-gray-800 text-lg mb-1">
        আপনি অনুদান পাঠিয়েছেন? এখানে জানিয়ে দিন
      </h2>

      <p className="text-xs text-gray-400 mb-5">
        আপনি যদি অনুদান পাঠিয়ে থাকেন, তাহলে এখানে তথ্য লিখে দিন। যাচাই করার পর এটি তালিকায় যোগ করা হবে।
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            কত টাকা পাঠিয়েছেন (৳)
          </label>

          <input
            type="number"
            value={form.amount}
            onChange={(e)=>setForm({...form,amount:e.target.value})}
            min="1"
            placeholder="যেমন: 500"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            কিভাবে পাঠিয়েছেন
          </label>

          <select
            value={form.method}
            onChange={(e)=>setForm({...form,method:e.target.value,bankName:"",bkashNumber:"",personName:""})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="bKash">bKash</option>
            <option value="Bank">ব্যাংক</option>
            <option value="Person">কারও হাতে দিয়েছেন</option>
          </select>
        </div>

        {form.method === "Bank" && (
          <div className="sm:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              কোন ব্যাংক
            </label>

            <input
              type="text"
              value={form.bankName}
              onChange={(e)=>setForm({...form,bankName:e.target.value})}
              placeholder="যেমন: Dutch Bangla Bank"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {form.method === "bKash" && (
          <div className="sm:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              bKash নম্বর
            </label>

            <input
              type="tel"
              value={form.bkashNumber}
              onChange={(e)=>setForm({...form,bkashNumber:e.target.value})}
              placeholder="01XXXXXXXXX"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {form.method === "Person" && (
          <div className="sm:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              কার কাছে দিয়েছেন
            </label>

            <input
              type="text"
              value={form.personName}
              onChange={(e)=>setForm({...form,personName:e.target.value})}
              placeholder="নাম লিখুন"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            মাস
          </label>

          <select
            value={form.month}
            onChange={(e)=>setForm({...form,month:Number(e.target.value)})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            বছর
          </label>

          <input
            type="number"
            value={form.year}
            onChange={(e)=>setForm({...form,year:Number(e.target.value)})}
            min="2023"
            max="2030"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-2">

          <label className="block text-sm font-semibold text-gray-700 mb-1">
            কিছু লিখতে চাইলে লিখুন (ঐচ্ছিক)
          </label>

          <input
            type="text"
            value={form.notes}
            onChange={(e)=>setForm({...form,notes:e.target.value})}
            placeholder="কোনো অতিরিক্ত তথ্য থাকলে লিখুন"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

        </div>

      </div>

      <div className="flex gap-3 mt-5">

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >

          <Send size={16} />

          {loading ? "পাঠানো হচ্ছে..." : "তথ্য জমা দিন"}

        </button>

      </div>

    </form>
  );
}

export default function DonationLog() {

  const { isAdmin } = useAuth();

  return (
    <div>

      <h1 className="text-2xl font-bold text-gray-800">
        অনুদানের তালিকা
      </h1>

      <p className="text-gray-500 text-sm">
        সদস্যদের দেওয়া অনুদানের তথ্য
      </p>

    </div>
  );
}