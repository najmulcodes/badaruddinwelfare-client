import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import {
  DollarSign,
  TrendingDown,
  Wallet,
  Users,
  HelpCircle,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6 flex items-center gap-4">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 break-words">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard"), api.get("/dashboard/analytics")])
      .then(([dashboardRes, analyticsRes]) => {
        setData(dashboardRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const fmt = (n) => `৳${(n || 0).toLocaleString("en-IN")}`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">স্বাগতম, {user?.name}!</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">আপনার সংস্থার টাকা আর কাজের সংক্ষিপ্ত হিসাব।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl shadow-lg p-6">
          <p className="text-emerald-200 text-sm mb-1">বর্তমান টাকা</p>
          <p className="text-4xl font-extrabold">{fmt(data?.availableFund)}</p>
          <p className="text-emerald-200 text-xs mt-2">মোট অনুদান − মোট খরচ</p>
        </div>

        <StatCard
          icon={<DollarSign size={24} className="text-blue-600" />}
          label="মোট অনুদান"
          value={fmt(data?.totalDonations)}
          color="bg-blue-100"
        />

        <StatCard
          icon={<TrendingDown size={24} className="text-red-500" />}
          label="মোট খরচ"
          value={fmt(data?.totalSpending)}
          color="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Users size={20} className="text-purple-600" />}
          label="মোট সদস্য"
          value={data?.totalMembers || 0}
          color="bg-purple-100"
        />

        <StatCard
          icon={<HelpCircle size={20} className="text-orange-500" />}
          label="নতুন সাহায্যের আবেদন"
          value={data?.newHelpRequests || 0}
          color="bg-orange-100"
        />

        <StatCard
          icon={<MessageSquare size={20} className="text-teal-500" />}
          label="নতুন মেসেজ"
          value={data?.unreadMessages || 0}
          color="bg-teal-100"
        />

        {isAdmin && (
          <StatCard
            icon={<Wallet size={20} className="text-amber-600" />}
            label="পেন্ডিং অনুদান"
            value={data?.pendingDonations || 0}
            color="bg-amber-100"
          />
        )}
      </div>

      {isAdmin && (
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">অনুদান বিশ্লেষণ</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard
              icon={<DollarSign size={20} className="text-emerald-600" />}
              label="মোট অনুদান"
              value={fmt(analytics?.totalDonations)}
              color="bg-emerald-100"
            />
            <StatCard
              icon={<BarChart3 size={20} className="text-sky-600" />}
              label="মোট অনুদানের সংখ্যা"
              value={analytics?.donationCount || 0}
              color="bg-sky-100"
            />
            <StatCard
              icon={<Wallet size={20} className="text-violet-600" />}
              label="এই মাসের অনুদান"
              value={fmt(analytics?.currentMonthDonations)}
              color="bg-violet-100"
            />
            <StatCard
              icon={<Users size={20} className="text-cyan-600" />}
              label="মোট সদস্য"
              value={analytics?.totalMembers || 0}
              color="bg-cyan-100"
            />
            <StatCard
              icon={<HelpCircle size={20} className="text-amber-600" />}
              label="অপেক্ষমান সাহায্যের আবেদন"
              value={analytics?.pendingHelpRequests || 0}
              color="bg-amber-100"
            />
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">সর্বশেষ অনুদান</h2>

          {data?.recentDonations?.length ? (
            <div className="space-y-3">
              {data.recentDonations.map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">{d.memberName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(d.date).toLocaleDateString("bn-BD")}
                    </p>
                  </div>

                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0">
                    {fmt(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">কোনো অনুদান নেই</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">সর্বশেষ খরচ</h2>

          {data?.recentSpendings?.length ? (
            <div className="space-y-3">
              {data.recentSpendings.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">{s.recipientName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{s.purpose}</p>
                  </div>

                  <span className="text-red-500 font-bold text-sm shrink-0">-{fmt(s.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">কোনো খরচ নেই</p>
          )}
        </div>
      </div>
    </div>
  );
}
