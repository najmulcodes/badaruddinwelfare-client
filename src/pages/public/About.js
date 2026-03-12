import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import logo1 from "../../assets/logo1.jpeg";
import memberLogo from "../../assets/member_logo.jpeg";

function MembersSection() {
  const [allMembers, setAllMembers] = useState([]);
  const [activeIds, setActiveIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/members/all"),
      api.get("/members/active"),
    ])
      .then(([allRes, activeRes]) => {
        setAllMembers(allRes.data);
        setActiveIds(new Set(activeRes.data.map((m) => m._id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allMembers.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">কোনো সদস্য পাওয়া যায়নি।</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {allMembers.map((m) => {
        const isActive = activeIds.has(m._id);
        return (
          <div
            key={m._id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
          >
            {/* Photo */}
            <div className="aspect-square overflow-hidden bg-emerald-50 relative">
              <img
                src={m.image && m.image.startsWith("http") ? m.image : memberLogo}
                alt={m.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = memberLogo; }}
              />
              {/* Active badge */}
              {isActive && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  সক্রিয়
                </div>
              )}
            </div>
            {/* Name */}
            <div className="p-3 text-center">
              <p className="font-semibold text-gray-800 text-sm leading-snug">{m.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isActive ? "এই মাসে অনুদান দিয়েছেন" : "সদস্য"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
            সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানোর লক্ষ্যে প্রতিষ্ঠিত হয়েছে।
          </p>
          <p className="text-gray-600 leading-relaxed text-base mt-3">
            আমাদের সংগঠন প্রতি মাসে সদস্যদের স্বেচ্ছামূলক অনুদানের মাধ্যমে পরিচালিত হয়।
            এই তহবিল দরিদ্র ও অসহায় মানুষদের চিকিৎসা, শিক্ষা এবং জরুরি সহায়তায় ব্যবহার করা হয়।
          </p>
        </section>

        {/* All Members */}
        <section>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
                আমাদের সদস্যবৃন্দ
              </h2>
              <p className="text-gray-500 text-sm mt-1 ml-3">
                সবুজ ব্যাজধারীরা এই মাসে অনুদান দিয়েছেন
              </p>
            </div>
          </div>
          <MembersSection />
        </section>

        {/* Mission cards */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🤝", title: "আমাদের লক্ষ্য", text: "সমাজের সুবিধাবঞ্চিত মানুষদের জীবনমান উন্নয়নে সহায়তা করা।" },
            { icon: "💚", title: "আমাদের মূল্যবোধ", text: "সততা, স্বচ্ছতা এবং মানবতার প্রতি দায়বদ্ধতাই আমাদের মূল চালিকাশক্তি।" },
            { icon: "🌟", title: "আমাদের দৃষ্টিভঙ্গি", text: "একটি সুখী, সুস্থ ও স্বাবলম্বী সমাজ গড়ার স্বপ্নে আমরা কাজ করে যাচ্ছি।" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
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
