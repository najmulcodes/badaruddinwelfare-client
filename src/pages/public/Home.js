import { Link } from "react-router-dom";
import {
  Heart,
  Utensils,
  Zap,
  Users,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import bannerImg from "../../assets/banner.png";
import logoImg from "../../assets/logo-circle.png";

const stats = [
  { value: "২৪+", label: "মাস সেবায়" },
  { value: "২০+", label: "সদস্য" },
  { value: "১০০+", label: "সহায়তা" },
  { value: "৳২ লক্ষ+", label: "তহবিল" },
];

const impactItems = [
  {
    key: "food-support",
    icon: <Utensils size={28} />,
    title: "খাদ্য সহায়তা",
    desc: "দরিদ্র পরিবারের মাঝে খাদ্য সহায়তা বিতরণ",
    delay: "0ms",
  },
  {
    key: "emergency-support",
    icon: <Zap size={28} />,
    title: "জরুরি সহায়তা",
    desc: "জরুরি পরিস্থিতিতে দ্রুত সহায়তা প্রদান",
    delay: "100ms",
  },
  {
    key: "medical-support",
    icon: <Heart size={28} />,
    title: "চিকিৎসা সহায়তা",
    desc: "অসহায় রোগীদের চিকিৎসার জন্য সহায়তা",
    delay: "200ms",
  },
  {
    key: "social-service",
    icon: <Users size={28} />,
    title: "সামাজিক সেবা",
    desc: "সমাজের উন্নয়নে একসাথে কাজ করা",
    delay: "300ms",
  },
];

const ImpactCard = ({ icon, title, desc, delay = "0ms" }) => (
  <div
    className="group relative overflow-hidden rounded-2xl bg-white p-5 text-center shadow-sm transition-all duration-500 hover:shadow-2xl md:p-6"
    style={{ animationDelay: delay }}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

    <div className="relative z-10">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 transition-all duration-500 group-hover:bg-white/20 md:mb-4 md:h-14 md:w-14">
        <div className="text-emerald-600 transition-colors duration-500 group-hover:text-white">
          {icon}
        </div>
      </div>

      <h3 className="mb-2 text-base font-bold text-gray-800 transition-colors duration-500 group-hover:text-white md:text-lg">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-emerald-100">
        {desc}
      </p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

        .hero-text {
          font-family: 'Hind Siliguri', sans-serif;
        }

        .hero-overlay {
          background: linear-gradient(
            135deg,
            rgba(2, 44, 34, 0.72) 0%,
            rgba(6, 95, 70, 0.6) 50%,
            rgba(4, 60, 45, 0.72) 100%
          );
        }

        .card-glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
        }

        .section-divider {
          height: 4px;
          background: linear-gradient(90deg, transparent, #10b981, #059669, transparent);
          border: none;
        }
      `}</style>

      {/* HERO */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden text-white md:min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bannerImg})`,
            filter: "brightness(0.75) saturate(1.1)",
          }}
        />

        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mb-6 inline-block md:mb-8">
            <img
              src={logoImg}
              alt="logo"
              className="h-20 w-20 rounded-full border-2 border-emerald-400/60 bg-white/10 p-2 object-contain shadow-2xl md:h-28 md:w-28"
            />
          </div>

          <div className="mb-4 md:mb-6">
            <span className="hero-text card-glass rounded-full px-4 py-2 text-xs font-medium tracking-wider text-emerald-300 md:text-sm">
              পারিবারিক কল্যাণ সংস্থা · ফেনী, বাংলাদেশ
            </span>
          </div>

          <h1 className="hero-text mb-4 text-3xl font-black leading-tight sm:text-4xl md:mb-6 md:text-6xl">
            আমাদের সমাজের
            <br />
            অসহায় মানুষের
            <br />
            <span className="text-emerald-400">পাশে দাঁড়াই</span>
          </h1>

          <p className="hero-text mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base md:mb-10 md:text-lg">
            গত ২৪ মাস ধরে আমরা একসাথে কাজ করছি।
            <br className="hidden sm:block" />
            আমাদের লক্ষ্য হলো সমাজের অসহায় ও দরিদ্র মানুষের পাশে দাঁড়ানো।
          </p>

          <div className="mb-12 flex flex-col justify-center gap-3 sm:flex-row md:mb-16 md:gap-4">
            <Link
              to="/about"
              className="hero-text flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-emerald-700 shadow-lg transition hover:scale-105 md:px-8 md:py-4"
            >
              আমাদের সম্পর্কে
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/request-help"
              className="hero-text card-glass flex items-center justify-center rounded-2xl px-6 py-3 font-bold text-white transition hover:bg-white/15 md:px-8 md:py-4"
            >
              সাহায্যের আবেদন করুন
            </Link>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {stats.map(({ value, label }) => (
              <div key={`${value}-${label}`} className="stat-card rounded-2xl px-2 py-3 md:px-3 md:py-4">
                <p className="hero-text text-xl font-black text-emerald-400 md:text-2xl">{value}</p>
                <p className="hero-text mt-1 text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/40 md:bottom-8">
          <span className="hero-text text-xs tracking-widest">স্ক্রল করুন</span>
          <ChevronDown size={20} />
        </div>
      </section>

      <hr className="section-divider" />

      {/* ABOUT */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <span className="hero-text mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
              আমাদের পরিচয়
            </span>

            <h2 className="hero-text mb-4 text-3xl font-black leading-tight text-gray-900 md:mb-5 md:text-4xl">
              আমরা কারা?
            </h2>

            <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />

            <p className="hero-text mb-4 leading-relaxed text-gray-600">
              আমরা একটি পারিবারিক অলাভজনক কল্যাণ সংস্থা। আমাদের পরিবারের প্রায় ২০ জন সদস্য
              প্রতি মাসে কিছু অর্থ জমা করেন। এই অর্থ দিয়ে আমরা আশেপাশের অসহায় মানুষের
              সহায়তা করি।
            </p>

            <p className="hero-text mb-8 leading-relaxed text-gray-600">
              আমাদের কাজ শুধু অর্থ সহায়তা দেওয়া নয়। খাদ্য সহায়তা, চিকিৎসা সহায়তা এবং
              জরুরি সময়ে মানুষের পাশে দাঁড়ানোই আমাদের প্রধান লক্ষ্য।
            </p>

            <Link
              to="/about"
              className="hero-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-emerald-700"
            >
              বিস্তারিত জানুন
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {impactItems.map(({ key, icon, title, desc, delay }) => (
              <ImpactCard key={key} icon={icon} title={title} desc={desc} delay={delay} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}