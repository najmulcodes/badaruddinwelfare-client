import React from "react";
import { Link } from "react-router-dom";
import { Heart, Utensils, Zap, Users } from "lucide-react";
import bannerImg from "../assets/banner.jpeg";
import logoImg from "../assets/logo2.png";

const ImpactCard = ({ icon, title, desc }) => (
  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center border-t-4 border-emerald-500">
    <div className="text-emerald-500 flex justify-center mb-3">{icon}</div>
    <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default function Home() {
  return (
    <div>
      {/* Hero — real banner image */}
      <section
        className="relative min-h-[580px] flex items-center justify-center text-white text-center px-4 py-20"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(6, 95, 70, 0.75)" }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <img
            src={logoImg}
            alt="Logo"
            className="w-24 h-24 rounded-full object-contain bg-white/10 backdrop-blur p-1 mx-auto mb-5 border-4 border-white/50 shadow-xl"
          />
          <span className="inline-block bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-4 font-medium">
            পারিবারিক কল্যাণ সংস্থা · ফেনী, বাংলাদেশ
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            আমাদের সমাজের অসহায়<br />মানুষের পাশে থাকি
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            গত ২৪ মাস ধরে আমরা একত্রিত হয়ে সমাজের দুঃস্থ ও অসহায় মানুষদের সহায়তা করে আসছি।
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/about"
              className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-lg"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              to="/request-help"
              className="px-8 py-4 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all duration-300 shadow-lg border border-white/30"
            >
              সাহায্যের আবেদন করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["২৪+", "মাস সেবায়"],
            ["২০+", "পরিবারের সদস্য"],
            ["১০০+", "মানুষকে সহায়তা"],
            ["৳২,০০,০০০+", "তহবিল সংগৃহীত"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-emerald-600">{num}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About summary */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">আমরা কারা?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              আমরা একটি পারিবারিক অলাভজনক সংস্থা। আমাদের পরিবারের প্রায় ২০ জন সদস্য প্রতি মাসে একটি নির্দিষ্ট পরিমাণ অর্থ জমা করেন এবং সেই অর্থ দিয়ে আমাদের আশেপাশের অসহায় মানুষদের সহায়তা করি।
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              আমাদের লক্ষ্য শুধু অর্থ সহায়তা নয় — খাদ্য, চিকিৎসা, শিক্ষা এবং জরুরি সাহায্য প্রদান করাই আমাদের মূল উদ্দেশ্য।
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              বিস্তারিত জানুন →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImpactCard icon={<Utensils size={32} />} title="খাদ্য সহায়তা" desc="দুঃস্থ পরিবারে নিয়মিত খাদ্য বিতরণ" />
            <ImpactCard icon={<Zap size={32} />} title="জরুরি সাহায্য" desc="বিপদে পড়া মানুষের পাশে থাকি" />
            <ImpactCard icon={<Heart size={32} />} title="চিকিৎসা সেবা" desc="অসহায় রোগীদের চিকিৎসা সহায়তা" />
            <ImpactCard icon={<Users size={32} />} title="সামাজিক সেবা" desc="সমাজের উন্নয়নে একসাথে কাজ" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">সাহায্যের প্রয়োজন?</h2>
        <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
          আপনি যদি সাহায্যের প্রয়োজন বোধ করেন, আমাদের কাছে আবেদন করুন। আমরা যথাসাধ্য সহায়তা করার চেষ্টা করব।
        </p>
        <Link
          to="/request-help"
          className="inline-block px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg"
        >
          এখনই আবেদন করুন
        </Link>
      </section>
    </div>
  );
}
