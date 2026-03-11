import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Utensils, Zap, Users, ArrowRight, ChevronDown } from "lucide-react";
import bannerImg from "../../assets/banner.jpeg";
import logoImg from "../../assets/logo2.png";

const ImpactCard = ({ icon, title, desc, delay }) => (
  <div
    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 text-center overflow-hidden"
    style={{ animationDelay: delay }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-emerald-50 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500">
        <div className="text-emerald-600 group-hover:text-white transition-colors duration-500">{icon}</div>
      </div>
      <h3 className="font-bold text-gray-800 group-hover:text-white text-lg mb-2 transition-colors duration-500">{title}</h3>
      <p className="text-gray-500 group-hover:text-emerald-100 text-sm leading-relaxed transition-colors duration-500">{desc}</p>
    </div>
  </div>
);

const StatItem = ({ num, label }) => (
  <div className="text-center group">
    <p className="text-4xl font-black text-emerald-600 mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">{num}</p>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
  </div>
);

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

        .hero-text { font-family: 'Hind Siliguri', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
        .animate-fade-up-delay-1 { animation: fadeUp 0.8s 0.15s ease both; }
        .animate-fade-up-delay-2 { animation: fadeUp 0.8s 0.3s ease both; }
        .animate-fade-up-delay-3 { animation: fadeUp 0.8s 0.45s ease both; }
        .animate-fade-up-delay-4 { animation: fadeUp 0.8s 0.6s ease both; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a7f3d0 40%, #fff 60%, #a7f3d0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .hero-overlay {
          background: linear-gradient(
            135deg,
            rgba(2, 44, 34, 0.92) 0%,
            rgba(6, 95, 70, 0.82) 50%,
            rgba(4, 60, 45, 0.90) 100%
          );
        }

        .card-glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
        }

        .btn-primary {
          background: white;
          color: #065f46;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary span { position: relative; z-index: 1; }

        .section-divider {
          height: 4px;
          background: linear-gradient(90deg, transparent, #10b981, #059669, transparent);
          border: none;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${bannerImg})`,
            filter: "brightness(0.4) saturate(1.2)",
          }}
        />

        {/* Gradient overlay */}
        <div className="hero-overlay absolute inset-0" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
        <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

        {/* Vertical line accents */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent hidden lg:block" />
        <div className="absolute right-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent hidden lg:block" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center py-20">
          {/* Logo with floating animation */}
          <div className="animate-fade-up animate-float mb-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl scale-150" />
              <img
                src={logoImg}
                alt="Logo"
                className="relative w-28 h-28 rounded-full object-contain bg-white/10 p-2 border-2 border-emerald-400/60 shadow-2xl"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="animate-fade-up-delay-1 mb-6">
            <span className="card-glass text-emerald-300 text-sm px-5 py-2 rounded-full font-medium tracking-wider inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" style={{animation: "pulse 2s infinite"}} />
              পারিবারিক কল্যাণ সংস্থা · ফেনী, বাংলাদেশ
            </span>
          </div>

          {/* Heading */}
          <h1 className="hero-text animate-fade-up-delay-2 text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="shimmer-text">আমাদের সমাজের</span>
            <br />
            <span className="text-white">অসহায় মানুষের</span>
            <br />
            <span className="text-emerald-400">পাশে থাকি</span>
          </h1>

          {/* Subtext */}
          <p className="hero-text animate-fade-up-delay-3 text-lg md:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            গত ২৪ মাস ধরে আমরা একত্রিত হয়ে সমাজের দুঃস্থ ও অসহায় মানুষদের সহায়তা করে আসছি।
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-4 flex flex-wrap gap-4 justify-center mb-16">
            <Link
              to="/about"
              className="btn-primary px-8 py-4 font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 flex items-center gap-2"
            >
              <span className="hero-text">আমাদের সম্পর্কে</span>
              <ArrowRight size={18} className="relative z-10" />
            </Link>
            <Link
              to="/request-help"
              className="card-glass px-8 py-4 text-white font-bold rounded-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/25 hero-text"
            >
              সাহায্যের আবেদন করুন
            </Link>
          </div>

          {/* Inline stats inside hero */}
          <div className="animate-fade-up-delay-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              ["২৪+", "মাস সেবায়"],
              ["২০+", "সদস্য"],
              ["১০০+", "সহায়তা"],
              ["৳২ লক্ষ+", "তহবিল"],
            ].map(([num, label]) => (
              <div key={label} className="stat-card rounded-2xl py-4 px-3">
                <p className="text-2xl font-black text-emerald-400 hero-text">{num}</p>
                <p className="text-white/60 text-xs mt-1 hero-text">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow text-white/40 flex flex-col items-center gap-1">
          <span className="text-xs tracking-widest hero-text">স্ক্রল করুন</span>
          <ChevronDown size={20} />
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── ABOUT ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3 block hero-text">আমাদের পরিচয়</span>
            <h2 className="text-4xl font-black text-gray-900 mb-5 leading-tight hero-text">
              আমরা <span className="text-emerald-600">কারা?</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4 hero-text">
              আমরা একটি পারিবারিক অলাভজনক সংস্থা। আমাদের পরিবারের প্রায় ২০ জন সদস্য প্রতি মাসে একটি নির্দিষ্ট পরিমাণ অর্থ জমা করেন এবং সেই অর্থ দিয়ে আমাদের আশেপাশের অসহায় মানুষদের সহায়তা করি।
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 hero-text">
              আমাদের লক্ষ্য শুধু অর্থ সহায়তা নয় — খাদ্য, চিকিৎসা, শিক্ষা এবং জরুরি সাহায্য প্রদান করাই আমাদের মূল উদ্দেশ্য।
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-200 hero-text"
            >
              বিস্তারিত জানুন <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImpactCard icon={<Utensils size={28} />} title="খাদ্য সহায়তা" desc="দুঃস্থ পরিবারে নিয়মিত খাদ্য বিতরণ" delay="0ms" />
            <ImpactCard icon={<Zap size={28} />} title="জরুরি সাহায্য" desc="বিপদে পড়া মানুষের পাশে থাকি" delay="100ms" />
            <ImpactCard icon={<Heart size={28} />} title="চিকিৎসা সেবা" desc="অসহায় রোগীদের চিকিৎসা সহায়তা" delay="200ms" />
            <ImpactCard icon={<Users size={28} />} title="সামাজিক সেবা" desc="সমাজের উন্নয়নে একসাথে কাজ" delay="300ms" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #047857 100%)" }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 50%, #34d399 0%, transparent 50%)" }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4 block hero-text">আমাদের সাথে যোগ দিন</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight hero-text">
            সাহায্যের <span className="text-emerald-400">প্রয়োজন?</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-400 rounded-full mx-auto mb-6" />
          <p className="text-emerald-100/80 mb-10 text-lg leading-relaxed hero-text">
            আপনি যদি সাহায্যের প্রয়োজন বোধ করেন, আমাদের কাছে আবেদন করুন। আমরা যথাসাধ্য সহায়তা করার চেষ্টা করব।
          </p>
          <Link
            to="/request-help"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-black/30 text-lg hero-text"
          >
            এখনই আবেদন করুন <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}