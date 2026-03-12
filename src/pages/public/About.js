import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import logo1 from "../../assets/logo1.jpeg";
import memberLogo from "../../assets/member_logo.jpeg";

// ── Local photo map ──────────────────────────────────────────────────────────
// Maps member names to local asset photos
// Add/edit names to match your DB exactly
const localPhotos = {};
const photoModules = import.meta.glob("../../assets/*.{jpg,jpeg,png}", {
  eager: true,
});
Object.entries(photoModules).forEach(([path, mod]) => {
  const filename = path.split("/").pop().replace(/\.[^.]+$/, ""); // strip extension
  localPhotos[filename] = mod.default;
});

function getMemberPhoto(member) {
  // Try exact name match first
  if (member.image && member.image.startsWith("http")) return member.image;
  // Try local asset by name
  const match = localPhotos[member.name];
  if (match) return match;
  // Fallback
  return memberLogo;
}

// ── Members Grid ─────────────────────────────────────────────────────────────
function MembersGrid({ members, tab }) {
  if (members.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12 text-lg">
        কোনো সদস্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {members.map((m, index) => (
        <div
          key={m._id}
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
        >
          <div className="relative aspect-square overflow-hidden bg-emerald-50">
            <img
              src={getMemberPhoto(m)}
              alt={m.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = memberLogo; }}
            />
            {tab === "top" && index < 3 && (
              <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md text-white
                ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : "bg-amber-600"}`}>
                {index + 1}
              </div>
            )}
          </div>
          <div className="p-3 text-center">
            <p className="font-semibold text-gray-800 text-sm leading-snug">
              {m.name}
            </p>
            {tab === "active" && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                সক্রিয় সদস্য
              </span>
            )}
            {tab === "top" && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-yellow-600 font-medium">
                <span className="text-yellow-500">★</span>
                শীর্ষ অবদানকারী
              </span>
            )}
            {tab === "all" && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
                সদস্য
              </span>
            )}
            {m.totalAmount != null && (
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                ৳{m.totalAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tabbed Members Section ────────────────────────────────────────────────────
function MembersSection() {
  const [activeTab, setActiveTab] = useState("active");
  const [data, setData] = useState({ active: [], top: [], all: [] });
  const [loading, setLoading] = useState({ active: false, top: false, all: false });
  const [loaded, setLoaded] = useState({ active: false, top: false, all: false });

  const fetchTab = (tab) => {
    if (loaded[tab]) return;
    setLoading((prev) => ({ ...prev, [tab]: true }));
    const endpoints = {
      active: "/members/active",
      top: "/members/top",
      all: "/members",
    };
    api
      .get(endpoints[tab])
      .then((res) => setData((prev) => ({ ...prev, [tab]: res.data })))
      .catch(() => setData((prev) => ({ ...prev, [tab]: [] })))
      .finally(() => {
        setLoading((prev) => ({ ...prev, [tab]: false }));
        setLoaded((prev) => ({ ...prev, [tab]: true }));
      });
  };

  useEffect(() => {
    fetchTab("active");
  }, []);

  const handleTab = (tab) => {
    setActiveTab(tab);
    fetchTab(tab);
  };

  const tabs = [
    { id: "active", label: "সক্রিয় সদস্য", icon: "🟢" },
    { id: "top", label: "শীর্ষ অবদানকারী", icon: "⭐" },
    { id: "all", label: "সকল সদস্য", icon: "👥" },
  ];

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading[activeTab] ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <MembersGrid members={data[activeTab]} tab={activeTab} />
      )}
    </div>
  );
}

// ── Main About Page ──────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-16 px-4 text-center">
        <img
          src={logo1}
          alt="Logo"
          className="w-24 h-24 object-contain mx-auto mb-5 rounded-full border-4 border-white/30 shadow-lg"
        />
        <h1 className="text-4xl font-extrabold mb-3">বদর উদ্দিন বেপারী কল্যাণ সংস্থা</h1>
        <p className="text-emerald-100 text-lg max-w-xl mx-auto">
          "সেবা ও উন্নয়নই আমাদের মূল লক্ষ্য"
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* About text */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
            আমাদের সম্পর্কে
          </h2>
          <p className="text-gray-600 leading-relaxed text-base">
            বদর উদ্দিন বেপারী কল্যাণ সংস্থা একটি পারিবারিক সামাজিক উদ্যোগ যা সমাজের
            সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানোর লক্ষ্যে প্রতিষ্ঠিত হয়েছে। আমরা বিশ্বাস করি
            যে একতা এবং পারস্পরিক সহযোগিতার মাধ্যমে আমরা একটি সুন্দর সমাজ গড়তে পারি।
          </p>
          <p className="text-gray-600 leading-relaxed text-base mt-3">
            আমাদের সংগঠন প্রতি মাসে সদস্যদের স্বেচ্ছামূলক অনুদানের মাধ্যমে পরিচালিত হয়।
            এই তহবিল দরিদ্র ও অসহায় মানুষদের চিকিৎসা, শিক্ষা এবং জরুরি সহায়তায় ব্যবহার করা হয়।
          </p>
        </section>

        {/* Members */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
                সদস্যবৃন্দ
              </h2>
              <p className="text-gray-500 text-sm mt-1 ml-3">
                আমাদের সকল সদস্যদের তথ্য
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-700 font-medium">লাইভ আপডেট</span>
            </div>
          </div>
          <MembersSection />
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🤝",
              title: "আমাদের লক্ষ্য",
              text: "সমাজের সুবিধাবঞ্চিত মানুষদের জীবনমান উন্নয়নে সহায়তা করা এবং পারিবারিক বন্ধন মজবুত রাখা।",
            },
            {
              icon: "💚",
              title: "আমাদের মূল্যবোধ",
              text: "সততা, স্বচ্ছতা এবং মানবতার প্রতি দায়বদ্ধতাই আমাদের মূল চালিকাশক্তি।",
            },
            {
              icon: "🌟",
              title: "আমাদের দৃষ্টিভঙ্গি",
              text: "একটি সুখী, সুস্থ ও স্বাবলম্বী সমাজ গড়ার স্বপ্নে আমরা প্রতিনিয়ত কাজ করে যাচ্ছি।",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}