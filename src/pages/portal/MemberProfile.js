import React, { useEffect, useState } from “react”;
import { useAuth } from “../../context/AuthContext”;
import api from “../../api/axios”;
import memberLogo from “../../assets/member_logo.jpeg”;
import { TrendingUp, Award, Calendar, DollarSign, Edit2, Users } from “lucide-react”;
import { Link } from “react-router-dom”;

const MONTHS_BN = [
“”, “জানুয়ারি”, “ফেব্রুয়ারি”, “মার্চ”, “এপ্রিল”, “মে”, “জুন”,
“জুলাই”, “আগস্ট”, “সেপ্টেম্বর”, “অক্টোবর”, “নভেম্বর”, “ডিসেম্বর”,
];

export default function MemberProfile() {
const { user } = useAuth();
const [donations, setDonations] = useState([]);
const [allMembers, setAllMembers] = useState([]);
const [membersList, setMembersList] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
Promise.all([
api.get(`/donations?member=${user._id}`),
api.get(”/donations”),
api.get(”/auth/members”),
])
.then(([myDons, allDons, members]) => {
setDonations(myDons.data);
setMembersList(members.data);

```
    // Calculate totals per member for ranking
    const totals = {};
    allDons.data.forEach((d) => {
      const id = d.member?._id || d.member;
      totals[id] = (totals[id] || 0) + d.amount;
    });
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    setAllMembers(sorted.map(([id, total]) => ({ id, total })));
  })
  .catch(() => {})
  .finally(() => setLoading(false));
```

}, [user._id]);

const totalDonated = donations.reduce((s, d) => s + d.amount, 0);
const myRank = allMembers.findIndex((m) => m.id === user._id) + 1;
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const donatedThisMonth = donations.some(
(d) => d.month === currentMonth && d.year === currentYear
);

// Group by year
const byYear = {};
donations.forEach((d) => {
if (!byYear[d.year]) byYear[d.year] = [];
byYear[d.year].push(d);
});

return (
<div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

```
  {/* Profile Card */}
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
    <div className="h-24 bg-gradient-to-r from-emerald-700 to-emerald-500" />
    <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
      <img
        src={user.image || memberLogo}
        alt={user.name}
        className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
        onError={(e) => { e.target.src = memberLogo; }}
      />
      <div className="flex-1 pb-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {user.phone && <p className="text-gray-400 text-sm">{user.phone}</p>}
          </div>
          <Link
            to="/portal/profile"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition border border-emerald-200"
          >
            <Edit2 size={14} /> প্রোফাইল সম্পাদনা
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Stats */}
  {loading ? (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: <DollarSign size={20} />,
            label: "মোট অনুদান",
            value: `৳${totalDonated.toLocaleString()}`,
            color: "emerald",
          },
          {
            icon: <Calendar size={20} />,
            label: "মোট মাস",
            value: donations.length,
            color: "blue",
          },
          {
            icon: <Award size={20} />,
            label: "র‍্যাংকিং",
            value: myRank > 0 ? `#${myRank}` : "—",
            color: "amber",
          },
          {
            icon: <TrendingUp size={20} />,
            label: "এই মাস",
            value: donatedThisMonth ? "✅ সক্রিয়" : "⏳ বাকি",
            color: donatedThisMonth ? "emerald" : "red",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
          >
            <div className={`inline-flex p-2 rounded-xl mb-2 bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Members List — read-only */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-600" />
            <h2 className="font-bold text-gray-800 text-lg">সক্রিয় সদস্য</h2>
          </div>
          <span className="text-sm text-gray-400">{membersList.length}জন</span>
        </div>
        {membersList.length === 0 ? (
          <div className="py-10 text-center text-gray-400">কোনো সদস্য পাওয়া যায়নি</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {membersList.map((m, index) => (
              <div key={m._id} className="px-6 py-4 flex items-center gap-4">
                <span className="text-sm font-bold text-gray-300 w-6 text-right">{index + 1}</span>
                <img
                  src={m.image || memberLogo}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  onError={(e) => { e.target.src = memberLogo; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{m.name}</p>
                  {m.fatherName && (
                    <p className="text-xs text-gray-400 truncate">পিতা: {m.fatherName}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  m.role === "admin"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {m.role === "admin" ? "Admin" : "Member"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-lg">অনুদানের ইতিহাস</h2>
          <span className="text-sm text-gray-400">{donations.length}টি রেকর্ড</span>
        </div>

        {donations.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            এখনো কোনো অনুদানের রেকর্ড নেই
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {Object.keys(byYear)
              .sort((a, b) => b - a)
              .map((year) => (
                <div key={year}>
                  {/* Year header */}
                  <div className="px-6 py-2 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">{year}</span>
                    <span className="text-sm text-emerald-600 font-bold">
                      ৳{byYear[year].reduce((s, d) => s + d.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  {byYear[year]
                    .sort((a, b) => b.month - a.month)
                    .map((d) => (
                      <div
                        key={d._id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                            {MONTHS_BN[d.month]?.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {MONTHS_BN[d.month]} {d.year}
                            </p>
                            {d.notes && (
                              <p className="text-xs text-gray-400">{d.notes}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-lg">
                          ৳{d.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  )}
</div>
```

);
}