import React from "react";
import { Link } from "react-router-dom";
import { Heart, Utensils, Zap, Users, ArrowRight, ChevronDown } from "lucide-react";
import bannerImg from "../../assets/banner.png";
import logoImg from "../../assets/logo-circle.png";

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

      @keyframes bounce-slow {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(6px); }
      }

      .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
      .animate-fade-up-delay-1 { animation: fadeUp 0.8s 0.15s ease both; }
      .animate-fade-up-delay-2 { animation: fadeUp 0.8s 0.3s ease both; }
      .animate-fade-up-delay-3 { animation: fadeUp 0.8s 0.45s ease both; }
      .animate-fade-up-delay-4 { animation: fadeUp 0.8s 0.6s ease both; }

      .hero-overlay {
        background: linear-gradient(
          135deg,
          rgba(2,44,34,0.72) 0%,
          rgba(6,95,70,0.60) 50%,
          rgba(4,60,45,0.70) 100%
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
      }

      .section-divider {
        height: 4px;
        background: linear-gradient(90deg, transparent, #10b981, #059669, transparent);
        border: none;
      }

      `}</style>

{/* HERO */}

<section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">

  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-105"
    style={{
      backgroundImage: `url(${bannerImg})`,
      filter: "brightness(0.75) saturate(1.1)"
    }}
  />

  {/* overlay */}
  <div className="hero-overlay absolute inset-0" />

  <div className="max-w-4xl mx-auto px-6 relative z-10 text-center py-20">

    {/* Logo */}
    <div className="animate-fade-up mb-8 inline-block">
      <img
        src={logoImg}
        alt="Logo"
        className="w-28 h-28 rounded-full object-contain bg-white/10 p-2 border-2 border-emerald-400/60 shadow-2xl"
      />
    </div>

    {/* badge */}
    <div className="animate-fade-up-delay-1 mb-6">
      <span className="card-glass text-emerald-300 text-sm px-5 py-2 rounded-full font-medium tracking-wider">
        পারিবারিক কল্যাণ সংস্থা · ফেনী, বাংলাদেশ
      </span>
    </div>

    {/* heading */}
    <h1 className="hero-text animate-fade-up-delay-2 text-5xl md:text-7xl font-black mb-6 leading-tight">

      আমাদের সমাজের  
      <br/>
      অসহায় মানুষের  
      <br/>
      <span className="text-emerald-400">পাশে আমরা আছি</span>

    </h1>

    {/* subtext */}
    <p className="hero-text animate-fade-up-delay-3 text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">

      গত ২৪ মাস ধরে আমরা একসাথে কাজ করে সমাজের দুঃস্থ,
      অসহায় এবং প্রয়োজনীয় মানুষের পাশে দাঁড়ানোর চেষ্টা করছি।

    </p>

    {/* buttons */}
    <div className="animate-fade-up-delay-4 flex flex-wrap gap-4 justify-center mb-16">

      <Link
        to="/about"
        className="btn-primary px-8 py-4 font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        আমাদের সম্পর্কে <ArrowRight size={18}/>
      </Link>

      <Link
        to="/request-help"
        className="card-glass px-8 py-4 text-white font-bold rounded-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/25"
      >
        সাহায্যের আবেদন করুন
      </Link>

    </div>

    {/* stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">

      {[
        ["২৪+", "মাস সেবায়"],
        ["২০+", "সদস্য"],
        ["১০০+", "সহায়তা"],
        ["৳২ লক্ষ+", "তহবিল"],
      ].map(([num,label]) => (

        <div key={label} className="stat-card rounded-2xl py-4 px-3">

          <p className="text-2xl font-black text-emerald-400 hero-text">
            {num}
          </p>

          <p className="text-white/60 text-xs mt-1 hero-text">
            {label}
          </p>

        </div>

      ))}

    </div>

  </div>

  {/* scroll */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow text-white/40 flex flex-col items-center gap-1">
    <span className="text-xs tracking-widest hero-text">স্ক্রল করুন</span>
    <ChevronDown size={20}/>
  </div>

</section>

<hr className="section-divider"/>

{/* ABOUT */}

<section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">

  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    <div>

      <span className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3 block hero-text">
        আমাদের পরিচয়
      </span>

      <h2 className="text-4xl font-black text-gray-900 mb-5 leading-tight hero-text">
        আমরা কারা?
      </h2>

      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-6"/>

      <p className="text-gray-600 leading-relaxed mb-4 hero-text">
        আমরা একটি পারিবারিক অলাভজনক কল্যাণ সংস্থা।
        আমাদের পরিবারের সদস্যরা প্রতি মাসে একটি নির্দিষ্ট
        অর্থ একত্রিত করেন এবং সেই অর্থ দিয়ে সমাজের
        অসহায় মানুষের পাশে দাঁড়ানোর চেষ্টা করি।
      </p>

      <p className="text-gray-600 leading-relaxed mb-8 hero-text">
        আমাদের লক্ষ্য শুধু অর্থ সহায়তা নয়।
        খাদ্য সহায়তা, চিকিৎসা সাহায্য এবং জরুরি
        প্রয়োজনে মানুষের পাশে থাকা আমাদের প্রধান উদ্দেশ্য।
      </p>

      <Link
        to="/about"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        বিস্তারিত জানুন <ArrowRight size={16}/>
      </Link>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <ImpactCard icon={<Utensils size={28}/>} title="খাদ্য সহায়তা" desc="অসহায় পরিবারকে খাদ্য সহায়তা প্রদান" />
      <ImpactCard icon={<Zap size={28}/>} title="জরুরি সহায়তা" desc="বিপদে পড়া মানুষকে দ্রুত সাহায্য" />
      <ImpactCard icon={<Heart size={28}/>} title="চিকিৎসা সহায়তা" desc="অসহায় রোগীদের চিকিৎসায় সহায়তা" />
      <ImpactCard icon={<Users size={28}/>} title="সামাজিক সেবা" desc="সমাজের উন্নয়নে একসাথে কাজ" />

    </div>

  </div>

</section>

</div>

  );
}