import React from "react";
import { Link } from "react-router-dom";
import { Heart, Utensils, Zap, Users, ArrowRight, ChevronDown } from "lucide-react";
<<<<<<< HEAD
import bannerImg from "../../assets/banner.PNG";
import logoImg from "../../assets/logo.PNG";
=======
import bannerImg from "../../assets/banner.png";
import logoImg from "../../assets/logo.png";
>>>>>>> b1e0a05d7fe7b1494e70e90e043980e0ca796367

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
      <h3 className="font-bold text-gray-800 group-hover:text-white text-lg mb-2 transition-colors duration-500">
        {title}
      </h3>
      <p className="text-gray-500 group-hover:text-emerald-100 text-sm leading-relaxed transition-colors duration-500">
        {desc}
      </p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${bannerImg})`,
            filter: "brightness(0.4) saturate(1.2)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-emerald-900/90" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center py-20">

          {/* Logo */}
          <div className="mb-8 inline-block">
            <img
              src={logoImg}
              alt="Logo"
              className="w-28 h-28 rounded-full object-contain bg-white/10 p-2 border-2 border-emerald-400/60 shadow-2xl"
            />
          </div>

          {/* Badge */}
          <div className="mb-6">
            <span className="text-emerald-300 text-sm px-5 py-2 rounded-full font-medium tracking-wider inline-flex items-center gap-2 border border-white/20">
              পারিবারিক কল্যাণ সংস্থা · ফেনী, বাংলাদেশ
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            আমরা সবসময়
            <br />
            অসহায় মানুষের
            <br />
            <span className="text-emerald-400">পাশে আছি</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            গত ২৪ মাস ধরে আমরা একসাথে কাজ করে
            আমাদের আশেপাশের অসহায় মানুষদের সাহায্য করে আসছি।
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              to="/about"
              className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              আমাদের সম্পর্কে জানুন <ArrowRight size={18} />
            </Link>

            <Link
              to="/request-help"
              className="px-8 py-4 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              সাহায্যের জন্য আবেদন করুন
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              ["২৪+", "মাস ধরে কাজ"],
              ["২০+", "সদস্য"],
              ["১০০+", "মানুষকে সহায়তা"],
              ["৳২ লক্ষ+", "তহবিল সংগ্রহ"],
            ].map(([num, label]) => (
              <div key={label} className="bg-white/10 rounded-2xl py-4 px-3 backdrop-blur">
                <p className="text-2xl font-black text-emerald-400">{num}</p>
                <p className="text-white/70 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-1">
          <span className="text-xs tracking-widest">স্ক্রল করুন</span>
          <ChevronDown size={20} />
        </div>

      </section>

      {/* ABOUT */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <span className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3 block">
              আমাদের পরিচয়
            </span>

            <h2 className="text-4xl font-black text-gray-900 mb-5 leading-tight">
              আমরা <span className="text-emerald-600">কারা?</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              আমরা একটি পারিবারিক অলাভজনক সংস্থা।
              আমাদের পরিবারের প্রায় ২০ জন সদস্য প্রতি মাসে কিছু অর্থ জমা করেন।
              সেই অর্থ দিয়ে আমরা আশেপাশের অসহায় মানুষদের সাহায্য করি।
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              আমরা শুধু অর্থ সহায়তা দিই না।
              খাদ্য, চিকিৎসা, শিক্ষা এবং জরুরি সহায়তাও দেওয়ার চেষ্টা করি।
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all"
            >
              বিস্তারিত জানুন <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImpactCard
              icon={<Utensils size={28} />}
              title="খাদ্য সহায়তা"
              desc="অসহায় পরিবারকে খাদ্য সহায়তা"
            />
            <ImpactCard
              icon={<Zap size={28} />}
              title="জরুরি সাহায্য"
              desc="বিপদে পড়া মানুষের পাশে থাকি"
            />
            <ImpactCard
              icon={<Heart size={28} />}
              title="চিকিৎসা সহায়তা"
              desc="অসহায় রোগীদের চিকিৎসা সহায়তা"
            />
            <ImpactCard
              icon={<Users size={28} />}
              title="সামাজিক সেবা"
              desc="সমাজের উন্নয়নে একসাথে কাজ"
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 text-center bg-emerald-900 text-white">

        <div className="relative z-10 max-w-2xl mx-auto">

          <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4 block">
            আমাদের সাথে যোগ দিন
          </span>

          <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            সাহায্যের <span className="text-emerald-400">প্রয়োজন?</span>
          </h2>

          <p className="text-emerald-100/80 mb-10 text-lg leading-relaxed">
            আপনার যদি সাহায্যের প্রয়োজন হয়,
            আমাদের কাছে আবেদন করুন।
            আমরা যথাসাধ্য সাহায্য করার চেষ্টা করব।
          </p>

          <Link
            to="/request-help"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all text-lg"
          >
            এখনই আবেদন করুন <ArrowRight size={20} />
          </Link>

        </div>

      </section>

    </div>
  );
}
