import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import logo1 from "../../assets/logo-square.png";
import memberLogo from "../../assets/member_logo.jpeg";
import { Heart, Users, Target, Eye, HandHeart, ShieldCheck, Star, MapPin } from "lucide-react";

// ── ফটো ম্যাপ ─────────────────────────────────────────────────────────────────
const localPhotos = {};
const photoModules = import.meta.glob("../../assets/*.{jpg,jpeg,png}", { eager: true });
Object.entries(photoModules).forEach(([path, mod]) => {
  const filename = path.split("/").pop().replace(/\.[^.]+$/, "");
  localPhotos[filename] = mod.default;
});

function getMemberPhoto(member) {
  if (member.image && member.image.startsWith("http")) return member.image;
  if (member.name && localPhotos[member.name]) return localPhotos[member.name];
  return memberLogo;
}

const currentMonthBn = new Date().toLocaleString("bn-BD", { month: "long" });

// ── ইন-ভিউ হুক ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── সদস্য গ্রিড ──────────────────────────────────────────────────────────────
function MembersGrid({ members, tab }) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 py-16 text-center">
        <p className="bn text-gray-400 text-lg">কোনো সদস্য পাওয়া যায়নি।</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {members.map((m, index) => (
        <div
          key={m._id}
          className="group rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative aspect-square overflow-hidden bg-emerald-50">
            <img
              src={getMemberPhoto(m)}
              alt={m.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = memberLogo; }}
            />
            {tab === "top" && index < 3 && (
              <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg text-white
                ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : "bg-amber-600"}`}>
                {index + 1}
              </div>
            )}
            {tab === "top" && index === 0 && (
              <div className="absolute top-2 right-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
          <div className="p-3 text-center">
            <p className="bn font-semibold text-gray-800 text-sm leading-snug">{m.name}</p>
            {tab === "active" && (
              <span className="bn inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {currentMonthBn}-এর দাতা
              </span>
            )}
            {tab === "top" && (
              <>
                <span className="bn inline-flex items-center gap-1 mt-1.5 text-xs text-yellow-600 font-medium">
                  <Star size={10} className="fill-yellow-500" />
                  শীর্ষ অনুদানকারী
                </span>
                {m.totalAmount != null && (
                  <p className="bn text-xs text-emerald-700 font-bold mt-0.5">
                    ৳{m.totalAmount.toLocaleString()}
                  </p>
                )}
              </>
            )}
            {tab === "all" && (
              <span className="bn inline-flex items-center gap-1 mt-1.5 text-xs text-gray-400 font-medium">
                সদস্য
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ট্যাবড মেম্বার সেকশন ─────────────────────────────────────────────────────
function MembersSection() {
  const [activeTab, setActiveTab] = useState("active");
  const [data, setData] = useState({ active: [], top: [], all: [] });
  const [loading, setLoading] = useState({ active: false, top: false, all: false });
  const [loaded, setLoaded] = useState({ active: false, top: false, all: false });

  const fetchTab = (tab) => {
    if (loaded[tab]) return;
    setLoading((prev) => ({ ...prev, [tab]: true }));
    const endpoints = { active: "/members/active", top: "/members/top", all: "/members" };
    api.get(endpoints[tab])
      .then((res) => setData((prev) => ({ ...prev, [tab]: res.data })))
      .catch(() => setData((prev) => ({ ...prev, [tab]: [] })))
      .finally(() => {
        setLoading((prev) => ({ ...prev, [tab]: false }));
        setLoaded((prev) => ({ ...prev, [tab]: true }));
      });
  };

  useEffect(() => { fetchTab("active"); }, []);

  const handleTab = (tab) => { setActiveTab(tab); fetchTab(tab); };

  const tabs = [
    { id: "active", label: `${currentMonthBn} মাসের দাতা`, icon: "🟢" },
    { id: "top", label: "শীর্ষ অনুদানকারী", icon: "⭐" },
    { id: "all", label: "সকল সদস্য", icon: "👥" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className={`bn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
              ${activeTab === tab.id
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

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

// ── মিশন ভিশন কার্ড ──────────────────────────────────────────────────────────
const missionItems = [
  {
    icon: <Target size={28} />,
    title: "আমাদের লক্ষ্য",
    color: "bg-emerald-100 text-emerald-700",
    desc: "সমাজের সুবিধাবঞ্চিত মানুষদের জীবনমান উন্নয়নে সহায়তা করা এবং পারিবারিক বন্ধন আরও মজবুত রাখা।",
  },
  {
    icon: <Eye size={28} />,
    title: "আমাদের দৃষ্টিভঙ্গি",
    color: "bg-blue-100 text-blue-700",
    desc: "একটি সুখী, সুস্থ ও স্বাবলম্বী সমাজ গড়ার স্বপ্নে আমরা প্রতিনিয়ত কাজ করে যাচ্ছি। ছোট ছোট পদক্ষেপেই বড় পরিবর্তন আসে।",
  },
  {
    icon: <Heart size={28} />,
    title: "আমাদের মূল্যবোধ",
    color: "bg-rose-100 text-rose-700",
    desc: "সততা, স্বচ্ছতা এবং মানবতার প্রতি দায়বদ্ধতাই আমাদের মূল চালিকাশক্তি। আমরা বিশ্বাস করি মানুষের জন্য মানুষ।",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "আমাদের প্রতিশ্রুতি",
    color: "bg-purple-100 text-purple-700",
    desc: "প্রতিটি অনুদানের সঠিক ব্যবহার নিশ্চিত করা। কোনো অপচয় নেই, কোনো অনিয়ম নেই।",
  },
];

export default function About() {
  return (
    <div className="bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        .bn { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>

      {/* ══════════════════ হিরো ══════════════════ */}
      <div className="relative overflow-hidden py-24 text-white text-center"
        style={{ background: "linear-gradient(155deg, #022c22 0%, #065f46 50%, #059669 100%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 px-4">
          <img
            src={logo1}
            alt="লোগো"
            className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-white/25 object-contain shadow-2xl bg-white/10 p-1"
          />
          <h1 className="bn text-4xl font-black mb-4 md:text-5xl">বদর উদ্দিন বেপারী কল্যাণ সংস্থা</h1>
          <p className="bn text-emerald-200 text-lg max-w-lg mx-auto leading-loose">
            "সেবা ও উন্নয়নই আমাদের মূল লক্ষ্য"
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[
              { icon: <MapPin size={14} />, text: "ফাজিলপুর, ফেনী, বাংলাদেশ" },
              { icon: <Users size={14} />, text: "২০+ পরিবারের সদস্য" },
              { icon: <HandHeart size={14} />, text: "২৪+ মাস সেবায়" },
            ].map((item, i) => (
              <span key={i} className="bn flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-20">

        {/* ══════════════════ আমাদের গল্প ══════════════════ */}
        <FadeIn>
          <section className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের গল্প
              </span>
              <h2 className="bn mb-5 text-3xl font-black text-gray-900 leading-tight">
                যেভাবে শুরু হয়েছিল এই উদ্যোগ
              </h2>
              <div className="mb-5 h-1 w-14 rounded-full bg-emerald-500" />
              <p className="bn mb-5 leading-loose text-gray-600">
                ফেনীর ফাজিলপুর এলাকায় একটি বড় পরিবার বাস করে। এই পরিবারের সদস্যরা দেখলেন,
                তাদের আশেপাশে অনেক মানুষ আছেন যারা চিকিৎসা করাতে পারছেন না, খাবার কিনতে পারছেন
                না, সন্তানকে পড়াতে পারছেন না।
              </p>
              <p className="bn mb-5 leading-loose text-gray-600">
                তখন পরিবারের বড়রা সিদ্ধান্ত নিলেন — প্রতি মাসে সবাই মিলে কিছু টাকা জমাবেন এবং
                সেই টাকা দিয়ে প্রকৃত অভাবীদের সাহায্য করবেন। সেই ছোট্ট সংকল্প থেকেই জন্ম নিল
                <strong className="text-emerald-700"> বদর উদ্দিন বেপারী কল্যাণ সংস্থা।</strong>
              </p>
              <p className="bn leading-loose text-gray-600">
                আজ প্রায় দুই বছর পরেও সেই উদ্যোগ চলছে। ২০ জনেরও বেশি সদস্য প্রতি মাসে
                নিয়মিত অনুদান দেন এবং শতাধিক মানুষের জীবনে ইতিবাচক পরিবর্তন এনেছেন।
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl bg-emerald-50 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700&q=80"
                alt="সংস্থার কার্যক্রম"
                className="w-full rounded-3xl object-cover shadow-xl"
                style={{ height: "380px" }}
              />
            </div>
          </section>
        </FadeIn>

        {/* ══════════════════ মিশন-ভিশন ══════════════════ */}
        <FadeIn delay={50}>
          <section>
            <div className="mb-10 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের ভিত্তি
              </span>
              <h2 className="bn text-3xl font-black text-gray-900">লক্ষ্য, দৃষ্টিভঙ্গি ও মূল্যবোধ</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {missionItems.map((item, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="bn mb-2 text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="bn leading-loose text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* ══════════════════ কীভাবে কাজ করি ══════════════════ */}
        <FadeIn>
          <section className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
            <div className="p-10 md:p-14">
              <div className="mb-10 text-center">
                <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  পরিচালন পদ্ধতি
                </span>
                <h2 className="bn text-3xl font-black text-gray-900">আমরা কীভাবে পরিচালিত হই</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-5">
                  {[
                    { title: "মাসিক চাঁদা", desc: "প্রতিটি সদস্য স্বেচ্ছায় মাসিক অনুদান দেন। কোনো বাধ্যবাধকতা নেই।" },
                    { title: "তহবিল ব্যবস্থাপনা", desc: "সংগৃহীত অর্থ একটি কেন্দ্রীয় তহবিলে জমা হয় এবং স্বচ্ছভাবে পরিচালিত হয়।" },
                    { title: "আবেদন যাচাই", desc: "সাহায্যের আবেদন পেলে প্রাথমিকভাবে যাচাই করা হয় এবং প্রকৃত প্রয়োজন নিশ্চিত করা হয়।" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="bn font-bold text-gray-800">{item.title}</p>
                        <p className="bn text-sm text-gray-600 leading-loose">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-5">
                  {[
                    { title: "মাসিক সভা", desc: "প্রতি মাসে সদস্যদের সভায় আবেদনগুলো পর্যালোচনা করে সহায়তার পরিমাণ নির্ধারণ করা হয়।" },
                    { title: "সহায়তা প্রদান", desc: "সিদ্ধান্ত গৃহীত হওয়ার পর দ্রুত সুবিধাভোগীর কাছে সহায়তা পৌঁছে দেওয়া হয়।" },
                    { title: "হিসাব প্রকাশ", desc: "প্রতিটি ব্যয়ের পূর্ণ বিবরণী সদস্যদের সামনে উপস্থাপন করা হয়।" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
                        {i + 4}
                      </div>
                      <div>
                        <p className="bn font-bold text-gray-800">{item.title}</p>
                        <p className="bn text-sm text-gray-600 leading-loose">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ══════════════════ সদস্যবৃন্দ ══════════════════ */}
        <FadeIn>
          <section>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="bn mb-2 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  আমাদের দল
                </span>
                <h2 className="bn text-3xl font-black text-gray-900">সদস্যবৃন্দ</h2>
                <p className="bn mt-2 text-gray-500">যাদের ভালোবাসায় চলছে এই উদ্যোগ</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="bn text-sm text-emerald-700 font-medium">লাইভ আপডেট</span>
              </div>
            </div>
            <MembersSection />
          </section>
        </FadeIn>

        {/* ══════════════════ যোগাযোগ ব্যানার ══════════════════ */}
        <FadeIn>
          <section
            className="rounded-3xl p-10 text-center text-white"
            style={{ background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)" }}
          >
            <HandHeart size={44} className="mx-auto mb-5 text-emerald-300" />
            <h2 className="bn mb-4 text-2xl font-black md:text-3xl">সাহায্যের প্রয়োজন হলে?</h2>
            <p className="bn mx-auto mb-8 max-w-xl leading-loose text-emerald-100">
              আপনি বা আপনার পরিচিত কেউ যদি সত্যিকারের সংকটে থাকেন, নির্দ্বিধায় আমাদের
              সাথে যোগাযোগ করুন অথবা আবেদন করুন।
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/request-help"
                className="bn rounded-2xl bg-white px-8 py-3 font-bold text-emerald-700 shadow transition hover:bg-emerald-50"
              >
                সহায়তার আবেদন করুন
              </a>
              <a
                href="/contact"
                className="bn rounded-2xl border border-white/30 bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                যোগাযোগ করুন
              </a>
            </div>
          </section>
        </FadeIn>

      </div>
    </div>
  );
}
