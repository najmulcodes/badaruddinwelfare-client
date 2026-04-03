import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, Utensils, Zap, Users, ArrowRight, ChevronDown,
  Quote, CheckCircle, HandHeart, ShieldCheck, Eye, Target
} from "lucide-react";
import bannerImg from "../../assets/banner.png";
import logoImg from "../../assets/logo-circle.png";
import demophoto from "../../assets/demoai.png";

// ── অ্যানিমেশন হুক ──────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
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

// ── কাউন্টার অ্যানিমেশন ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  const toBanglaNum = (n) =>
    String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[d]);
  return <span ref={ref}>{toBanglaNum(count)}{suffix}</span>;
}

// ── ফেড-ইন সেকশন ─────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── স্ট্যাটস ──────────────────────────────────────────────────────────────────
const stats = [
  { target: 24, suffix: "+", label: "মাস ধরে সেবায়" },
  { target: 20, suffix: "+", label: "পরিবারের সদস্য" },
  { target: 150, suffix: "+", label: "মানুষকে সহায়তা" },
  { target: 2, suffix: " লক্ষ+", label: "টাকা তহবিল" },
];

// ── কার্যক্রম ─────────────────────────────────────────────────────────────────
const activities = [
  {
    icon: <Heart size={26} />,
    title: "চিকিৎসা সহায়তা",
    desc: "গুরুতর অসুস্থ ও আর্থিকভাবে অসচ্ছল রোগীদের চিকিৎসার ব্যয় বহন করা হয়। হাসপাতালের খরচ, ওষুধ ও পরীক্ষা-নিরীক্ষায় সহায়তা প্রদান করা হয়।",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: <Utensils size={26} />,
    title: "খাদ্য সহায়তা",
    desc: "দুর্যোগকালীন ও নিত্যদিনের সংকটে পড়া পরিবারগুলোকে খাদ্যসামগ্রী বিতরণ করা হয়। ঈদে বিশেষ খাদ্য সহায়তাও প্রদান করা হয়।",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: <Zap size={26} />,
    title: "জরুরি সহায়তা",
    desc: "প্রাকৃতিক দুর্যোগ, দুর্ঘটনা বা আকস্মিক সংকটে দ্রুততার সাথে সহায়তা পাঠানো হয়। প্রতিটি আবেদন পর্যালোচনা করে দ্রুত সিদ্ধান্ত নেওয়া হয়।",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: <Users size={26} />,
    title: "সামাজিক উদ্যোগ",
    desc: "শীতবস্ত্র বিতরণ, শিক্ষাবৃত্তি প্রদান এবং সমাজের অবহেলিত মানুষের পুনর্বাসনে সংস্থাটি নিরলসভাবে কাজ করে যাচ্ছে।",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

// ── সাক্ষ্য ──────────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "আমার মায়ের অপারেশনের সময় পাশে দাঁড়িয়েছিল এই সংস্থা। আল্লাহ তাদের ভালো রাখুক।",
    name: "রাহেলা বেগম",
    place: "ফাজিলপুর, ফেনী",
    initials: "রা",
  },
  {
    quote: "শীতের সময় কম্বল পেয়েছিলাম। ঠান্ডায় কষ্ট পেতাম, তারা সেটা বুঝেছিল।",
    name: "আবদুল করিম",
    place: "ছাগলনাইয়া, ফেনী",
    initials: "আ",
  },
  {
    quote: "ছেলের পড়াশোনার খরচ দিতে পারছিলাম না। সংস্থার সহায়তায় এখন সে কলেজে পড়ছে।",
    name: "নাছিমা খাতুন",
    place: "পরশুরাম, ফেনী",
    initials: "না",
  },
];

// ── কিভাবে কাজ করি ──────────────────────────────────────────────────────────
const steps = [
  { num: "০১", title: "আবেদন গ্রহণ", desc: "যেকোনো অসহায় মানুষ আমাদের ওয়েবসাইট বা সরাসরি যোগাযোগের মাধ্যমে সহায়তার আবেদন করতে পারেন।" },
  { num: "০২", title: "যাচাই-বাছাই", desc: "আবেদনকারীর পরিস্থিতি সরেজমিনে যাচাই করা হয়। প্রকৃত প্রয়োজন নিশ্চিত হলে তালিকায় অন্তর্ভুক্ত করা হয়।" },
  { num: "০৩", title: "সভায় সিদ্ধান্ত", desc: "প্রতি মাসে সদস্যদের সভায় আবেদনগুলো পর্যালোচনা করে সর্বসম্মতিক্রমে সহায়তার পরিমাণ নির্ধারণ করা হয়।" },
  { num: "০৪", title: "সহায়তা প্রদান", desc: "সিদ্ধান্ত গৃহীত হওয়ার পর দ্রুততম সময়ের মধ্যে সরাসরি সুবিধাভোগীর কাছে সহায়তা পৌঁছে দেওয়া হয়।" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        .bn { font-family: 'Hind Siliguri', sans-serif; }
        .stat-glass {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
        }
        .activity-card:hover .activity-icon-wrap {
          transform: scale(1.1) rotate(-3deg);
        }
      `}</style>

      {/* ══════════════════ হিরো ══════════════════ */}
      <section className="relative min-h-screen overflow-hidden text-white">

        {/* BACKGROUND IMAGE */}
        <img
          src={bannerImg}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* OVERLAY — dark enough to hide any embedded text in the image */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(2,44,34,0.93) 0%, rgba(6,95,70,0.85) 55%, rgba(4,78,56,0.80) 100%)" }}
        />

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-20">

          {/* MAIN CONTENT */}
          <div className="flex flex-1 items-center justify-end">
            <div className="max-w-3xl w-full text-right">

              {/* BADGE */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-emerald-200 backdrop-blur-md">
                ফেনী, বাংলাদেশ · পারিবারিক কল্যাণ সংস্থা
              </div>

              {/* LOGO */}
              <img
                src={logoImg}
                alt="লোগো"
                className="mb-6 h-20 w-20 rounded-full border border-white/30 bg-white/10 p-2"
              />

              {/* HEADING */}
          <h1 className="hero-text animate-fade-up-delay-2 text-5xl md:text-6xl font-black mb-6 leading-tight">
                অসহায় মানুষের 
                <p>
                <span className="text-emerald-400">পাশে থাকি</span> সবসময়
              </p>
              </h1>

              {/* DESCRIPTION */}
              <p className="bn mt-6 max-w-full text-lg text-white/80 leading-relaxed">
                বদর উদ্দিন বেপারী কল্যাণ সংস্থা একটি পারিবারিক উদ্যোগ, যেখানে সদস্যরা একত্রিত হয়ে অসহায় মানুষের পাশে দাঁড়ান।
              </p>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-end">
                <Link
                  to="/request-help"
                  className="bn flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400 hover:scale-105"
                >
                  সহায়তার আবেদন করুন
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="bn rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  আমাদের সম্পর্কে জানুন
                </Link>
              </div>

              {/* STATS ROW */}
              <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl ml-auto">
                {stats.map((s, i) => (
                  <div key={i} className="stat-glass rounded-2xl px-4 py-5 text-center backdrop-blur-sm">
                    <p className="bn text-2xl font-black text-emerald-400">
                      <AnimatedCounter target={s.target} suffix={s.suffix} />
                    </p>
                    <p className="bn mt-1 text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="flex flex-col items-center gap-1 text-white/40 animate-bounce mt-8">
            <span className="bn text-xs">নিচে স্ক্রল করুন</span>
            <ChevronDown size={18} />
          </div>

        </div>

        {/* FLOATING CARD — bottom right, absolutely positioned inside section */}
        <div className="absolute bottom-10 right-10 hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl lg:block">
          <p className="text-3xl font-bold text-emerald-400">২৪+</p>
          <p className="bn text-sm text-white/70">মাস সেবা</p>
        </div>

      </section>

      {/* ══════════════════ পরিচয় ══════════════════ */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <FadeIn delay={0}>
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের পরিচয়
              </span>
              <h2 className="bn mb-5 text-3xl font-black leading-tight text-gray-900 md:text-4xl">
                কীভাবে শুরু হয়েছিল
                <br />
                এই যাত্রা?
              </h2>
              <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
              <p className="bn mb-5 leading-loose text-gray-600 text-base">
                প্রায় দুই বছর আগে, আমাদের পরিবারের কয়েকজন সদস্য মিলে ভাবলেন — আমরা যদি
                প্রতি মাসে একটু একটু করে জমাই, তাহলে পাশের মানুষটার বিপদে কাজে লাগতে পারব।
                সেই ছোট্ট ভাবনা থেকেই জন্ম নিল <strong>বদর উদ্দিন বেপারী কল্যাণ সংস্থা।</strong>
              </p>
              <p className="bn mb-7 leading-loose text-gray-600 text-base">
                আজ ২০ জনেরও বেশি সদস্য প্রতি মাসে স্বেচ্ছায় অনুদান দেন। সেই অর্থ দিয়ে
                চিকিৎসা, খাদ্য এবং জরুরি সহায়তায় ১৫০ জনেরও বেশি মানুষের পাশে দাঁড়ানো
                সম্ভব হয়েছে।
              </p>
              <ul className="bn space-y-3 text-gray-700">
                {[
                  "সম্পূর্ণ স্বেচ্ছাসেবী ও অলাভজনক উদ্যোগ",
                  "প্রতিটি অনুদানের হিসাব স্বচ্ছভাবে রাখা হয়",
                  "পরিবারের বাইরের মানুষও সহায়তা পান",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-emerald-100 -z-10" />
                <img
                  src={demophoto}
                  alt="সংস্থার কার্যক্রম"
                  className="w-full rounded-3xl object-cover shadow-xl"
                  style={{ height: "420px" }}
                />
                <div className="absolute -bottom-5 -right-5 rounded-2xl bg-emerald-600 p-5 shadow-xl">
                  <p className="bn text-3xl font-black text-white">২৪+</p>
                  <p className="bn text-sm text-emerald-200">মাস সেবায়</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════ কার্যক্রম ══════════════════ */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="mb-14 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের কাজ
              </span>
              <h2 className="bn text-3xl font-black text-gray-900 md:text-4xl">
                আমরা যেভাবে সহায়তা করি
              </h2>
              <p className="bn mx-auto mt-4 max-w-xl text-gray-500 leading-loose">
                সমাজের বিভিন্ন সংকটে আমরা বিভিন্নভাবে পাশে দাঁড়াই।
                প্রতিটি সহায়তার পেছনে আছে সদস্যদের ভালোবাসা ও দায়িত্ববোধ।
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((act, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="activity-card group h-full rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                  <div className={`activity-icon-wrap mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 ${act.bg}`}>
                    <span className={act.iconColor}>{act.icon}</span>
                  </div>
                  <h3 className="bn mb-3 text-lg font-bold text-gray-800">{act.title}</h3>
                  <p className="bn text-sm leading-loose text-gray-500">{act.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ কীভাবে কাজ করি ══════════════════ */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-16 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের পদ্ধতি
              </span>
              <h2 className="bn text-3xl font-black text-gray-900 md:text-4xl">
                আবেদন থেকে সহায়তা পর্যন্ত
              </h2>
            </div>
          </FadeIn>

          <div className="relative grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-200">
                    <span className="bn text-lg font-black text-white">{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-emerald-400 to-emerald-100 md:block" />
                  )}
                  <h3 className="bn mb-2 text-lg font-bold text-gray-800">{step.title}</h3>
                  <p className="bn text-sm leading-loose text-gray-500">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ প্রভাব সংখ্যা ══════════════════ */}
      <section
        className="relative px-4 py-20 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-14 text-center">
              <h2 className="bn text-3xl font-black md:text-4xl">
                সংখ্যায় আমাদের পথচলা
              </h2>
              <p className="bn mt-4 text-emerald-200">
                গত দুই বছরে যা অর্জন করেছি — তা আপনাদের ভালোবাসায়
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { target: 24, suffix: "+", label: "মাস ধরে চলছে", icon: "📅" },
              { target: 20, suffix: "+", label: "পরিবারের সদস্য", icon: "👨‍👩‍👧‍👦" },
              { target: 150, suffix: "+", label: "মানুষকে সহায়তা", icon: "🤝" },
              { target: 200000, suffix: "+", label: "টাকা বিতরণ", icon: "💰" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="rounded-2xl bg-white/10 p-6 text-center border border-white/15">
                  <p className="mb-2 text-3xl">{s.icon}</p>
                  <p className="bn text-4xl font-black text-white">
                    <AnimatedCounter target={s.target} suffix={s.suffix} />
                  </p>
                  <p className="bn mt-2 text-sm text-emerald-200">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ সাক্ষ্য ══════════════════ */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-14 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                উপকারভোগীদের কথা
              </span>
              <h2 className="bn text-3xl font-black text-gray-900 md:text-4xl">
                তারা যা বলেন
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="relative rounded-2xl bg-white p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <Quote size={32} className="mb-4 text-emerald-200" />
                  <p className="bn mb-6 leading-loose text-gray-600 text-sm italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="bn font-bold text-gray-800">{t.name}</p>
                      <p className="bn text-xs text-gray-400">{t.place}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ স্বচ্ছতা ══════════════════ */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <FadeIn>
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের প্রতিশ্রুতি
              </span>
              <h2 className="bn mb-5 text-3xl font-black text-gray-900 md:text-4xl">
                স্বচ্ছতা ও
                <br />
                জবাবদিহিতা
              </h2>
              <p className="bn mb-7 leading-loose text-gray-600">
                আমরা বিশ্বাস করি, মানুষের দেওয়া অর্থের সঠিক ব্যবহার নিশ্চিত করা
                আমাদের প্রথম দায়িত্ব। প্রতিটি টাকার হিসাব সদস্যদের সামনে উন্মুক্ত থাকে।
              </p>
              <div className="space-y-4">
                {[
                  { icon: <ShieldCheck size={20} />, title: "মাসিক আয়-ব্যয়ের হিসাব", desc: "প্রতি মাসে সকল সদস্যকে সম্পূর্ণ আর্থিক বিবরণী জানানো হয়।" },
                  { icon: <Eye size={20} />, title: "সুবিধাভোগীর তথ্য প্রকাশ", desc: "কাকে কত টাকা দেওয়া হয়েছে তা সদস্যরা জানতে পারেন।" },
                  { icon: <Target size={20} />, title: "লক্ষ্যভিত্তিক ব্যয়", desc: "প্রতিটি ব্যয় নির্দিষ্ট উদ্দেশ্যে করা হয়, কোনো অপচয় নেই।" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      {item.icon}
                    </div>
                    <div>
                      <p className="bn font-bold text-gray-800">{item.title}</p>
                      <p className="bn text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700&q=80"
                  alt="স্বচ্ছতা"
                  className="w-full object-cover"
                  style={{ height: "460px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent flex items-end p-8">
                  <div>
                    <p className="bn text-2xl font-black text-white leading-snug">
                      "আপনার বিশ্বাসই আমাদের সবচেয়ে বড় সম্পদ"
                    </p>
                    <p className="bn mt-2 text-emerald-300 text-sm">— সংস্থার প্রতিষ্ঠাতা সদস্যরা</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════ কল টু অ্যাকশন ══════════════════ */}
      <section
        className="px-4 py-20"
        style={{ background: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #047857 100%)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-5 flex justify-center">
              <HandHeart size={48} className="text-emerald-400" />
            </div>
            <h2 className="bn mb-5 text-3xl font-black text-white md:text-4xl">
              আপনিও পাশে দাঁড়ান
            </h2>
            <p className="bn mb-10 leading-loose text-emerald-200 text-base">
              কেউ যদি সাহায্য চান, নির্দ্বিধায় আবেদন করুন।
              আমরা সাধ্যমতো পাশে থাকার চেষ্টা করব।
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/request-help"
                className="bn flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-300 hover:scale-105"
              >
                সহায়তার আবেদন করুন
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="bn flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/20"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}