import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import { DollarSign, TrendingDown, Wallet, Users, HelpCircle, MessageSquare } from "lucide-react";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const fmt = (n) => `৳${(n || 0).toLocaleString("en-IN")}`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">স্বাগতম, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">আপনার সংস্থার তহবিল ও কার্যক্রমের সারসংক্ষেপ।</p>
      </div>

      {/* Fund summary - big cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl shadow-lg p-6">
          <p className="text-emerald-200 text-sm mb-1">বর্তমান তহবিল</p>
          <p className="text-4xl font-extrabold">{fmt(data?.availableFund)}</p>
          <p className="text-emerald-200 text-xs mt-2">মোট সংগ্রহ − মোট ব্যয়</p>
        </div>
        <StatCard icon={<DollarSign size={24} className="text-blue-600" />} label="মোট সংগৃহীত" value={fmt(data?.totalDonations)} color="bg-blue-100" />
        <StatCard icon={<TrendingDown size={24} className="text-red-500" />} label="মোট ব্যয়" value={fmt(data?.totalSpending)} color="bg-red-100" />
      </div>

      {/* Other stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users size={20} className="text-purple-600" />} label="সক্রিয় সদস্য" value={data?.totalMembers || 0} color="bg-purple-100" />
        <StatCard icon={<HelpCircle size={20} className="text-orange-500" />} label="নতুন আবেদন" value={data?.newHelpRequests || 0} color="bg-orange-100" />
        <StatCard icon={<MessageSquare size={20} className="text-teal-500" />} label="অপঠিত বার্তা" value={data?.unreadMessages || 0} color="bg-teal-100" />
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent donations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-4">সাম্প্রতিক অনুদান</h2>
          {data?.recentDonations?.length ? (
            <div className="space-y-3">
              {data.recentDonations.map((d) => (
                <div key={d._id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{d.memberName}</p>
                    <p className="text-xs text-gray-400">{new Date(d.date).toLocaleDateString("bn-BD")}</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-sm">{fmt(d.amount)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">কোনো অনুদান নেই</p>}
        </div>

        {/* Recent spending */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-4">সাম্প্রতিক ব্যয়</h2>
          {data?.recentSpendings?.length ? (
            <div className="space-y-3">
              {data.recentSpendings.map((s) => (
                <div key={s._id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{s.recipientName}</p>
                    <p className="text-xs text-gray-400">{s.purpose}</p>
                  </div>
                  <span className="text-red-500 font-bold text-sm">-{fmt(s.amount)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">কোনো ব্যয় নেই</p>}
        </div>
      </div>
    </div>
  );
}
