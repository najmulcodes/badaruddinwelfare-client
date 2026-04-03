import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { PageLoader } from "../../components/LoadingSpinner";
import { CalendarDays, Heart, Utensils, Zap, Users, BookOpen, Shirt, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

// ── ফলব্যাক পোস্ট ────────────────────────────────────────────────────────────
const fallbackPosts = [
  {
    _id: "1",
    title: "শীতবস্ত্র বিতরণ কর্মসূচি ২০২৩",
    date: "2023-12-25",
    description: "গত শীতে আমরা প্রায় ৫০টি পরিবারের মাঝে কম্বল ও গরম কাপড় বিতরণ করেছি। ফেনীর ফাজিলপুর ও আশেপাশের এলাকায় দরিদ্র পরিবারগুলো এই সহায়তা পান।",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80",
  },
  {
    _id: "2",
    title: "বিনামূল্যে স্বাস্থ্যসেবা সহায়তা",
    date: "2023-11-10",
    description: "আমাদের সংস্থার তহবিল থেকে ১৫ জন গুরুতর রোগীর চিকিৎসা ব্যয় বহন করা হয়েছে। তাদের মধ্যে ৬ জন শিশু এবং ৯ জন বয়স্ক মানুষ ছিলেন।",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
  },
  {
    _id: "3",
    title: "মেধাবী শিক্ষার্থীদের সহায়তা",
    date: "2023-10-15",
    description: "পাঁচজন মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল শিক্ষার্থীকে তাদের পড়াশোনার ব্যয় নির্বাহে সহায়তা করা হয়েছে। তারা এখন নিয়মিত পড়াশোনা করতে পারছেন।",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
  },
  {
    _id: "4",
    title: "ঈদ উপলক্ষে খাদ্যসামগ্রী বিতরণ",
    date: "2023-04-20",
    description: "ঈদুল ফিতর উপলক্ষে ৩০টি অসহায় পরিবারকে চাল, ডাল, তেল ও চিনিসহ প্রয়োজনীয় খাদ্যসামগ্রী দেওয়া হয়েছে। সবাই যেন আনন্দের সাথে ঈদ উদযাপন করতে পারেন।",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80",
  },
  {
    _id: "5",
    title: "বন্যায় ক্ষতিগ্রস্তদের সহায়তা",
    date: "2023-09-05",
    description: "ফেনী জেলায় বন্যায় ক্ষতিগ্রস্ত পরিবারগুলোকে জরুরি সহায়তা হিসেবে শুকনো খাবার ও বিশুদ্ধ পানি পাঠানো হয়েছে।",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80",
  },
  {
    _id: "6",
    title: "গৃহহীন পরিবারের পুনর্বাসন",
    date: "2023-07-14",
    description: "অগ্নিকাণ্ডে ক্ষতিগ্রস্ত একটি পরিবারকে ঘর মেরামতের জন্য আর্থিক সহায়তা এবং প্রয়োজনীয় সামগ্রী দেওয়া হয়েছে।",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80",
  },
];

// ── কার্যক্রমের ধরন ──────────────────────────────────────────────────────────
const workCategories = [
  { icon: <Heart size={22} />, label: "চিকিৎসা সহায়তা", color: "bg-rose-100 text-rose-600" },
  { icon: <Utensils size={22} />, label: "খাদ্য সহায়তা", color: "bg-amber-100 text-amber-600" },
  { icon: <Zap size={22} />, label: "জরুরি সহায়তা", color: "bg-blue-100 text-blue-600" },
  { icon: <BookOpen size={22} />, label: "শিক্ষা সহায়তা", color: "bg-purple-100 text-purple-600" },
  { icon: <Shirt size={22} />, label: "শীতবস্ত্র বিতরণ", color: "bg-cyan-100 text-cyan-600" },
  { icon: <Users size={22} />, label: "সামাজিক উদ্যোগ", color: "bg-emerald-100 text-emerald-600" },
];

// ── সাফল্যের সংখ্যা ──────────────────────────────────────────────────────────
const achievements = [
  { value: "১৫০+", label: "উপকারভোগী পরিবার" },
  { value: "৩০+", label: "চিকিৎসা সহায়তা" },
  { value: "৫০+", label: "শীতবস্ত্র বিতরণ" },
  { value: "২৪", label: "মাসের কার্যক্রম" },
];

export default function OurWork() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news")
      .then(({ data }) => setPosts(data.length ? data : fallbackPosts))
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const toBanglaDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("bn-BD", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return dateStr; }
  };

  return (
    <div className="bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        .bn { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>

      {/* ══════════════════ হিরো ══════════════════ */}
      <div
        className="relative overflow-hidden py-24 text-white text-center"
        style={{ background: "linear-gradient(155deg, #022c22 0%, #065f46 60%, #059669 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative z-10 px-4">
          <span className="bn mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm text-emerald-300 border border-white/15">
            আমাদের কার্যক্রম
          </span>
          <h1 className="bn text-4xl font-black md:text-5xl mb-4">আমরা যা করেছি</h1>
          <p className="bn mx-auto max-w-xl text-emerald-200 text-base leading-loose">
            গত দুই বছরে সংস্থার সদস্যদের ঐকান্তিক প্রচেষ্টায় অনেক মানুষের পাশে
            দাঁড়ানো সম্ভব হয়েছে। এখানে আমাদের কিছু উল্লেখযোগ্য কার্যক্রমের বিবরণ।
          </p>
        </div>
      </div>

      {/* ══════════════════ সাফল্যের সংখ্যা ══════════════════ */}
      <div className="bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4">
          {achievements.map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm">
                <p className="bn text-3xl font-black text-emerald-600">{item.value}</p>
                <p className="bn mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ══════════════════ কার্যক্রমের ধরন ══════════════════ */}
      <div className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-10 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                কী ধরনের সহায়তা করি
              </span>
              <h2 className="bn text-3xl font-black text-gray-900">আমাদের কার্যক্রমের ক্ষেত্রসমূহ</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {workCategories.map((cat, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="rounded-2xl bg-white border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <p className="bn text-xs font-semibold text-gray-700 leading-tight">{cat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ বৈশিষ্ট্যযুক্ত কার্যক্রম ══════════════════ */}
      {posts.length > 0 && (
        <div className="bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <div className="mb-4 overflow-hidden rounded-3xl shadow-xl">
                <div className="grid md:grid-cols-2">
                  <div className="relative overflow-hidden" style={{ minHeight: "320px" }}>
                    <img
                      src={posts[0].image || "https://images.unsplash.com/photo-1593113630400-ea4288922559?w=700&q=80"}
                      alt={posts[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
                  <div className="bg-white p-10 flex flex-col justify-center">
                    <span className="bn mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 w-fit">
                      সাম্প্রতিক কার্যক্রম
                    </span>
                    <h3 className="bn mb-4 text-2xl font-black text-gray-900 leading-snug">
                      {posts[0].title}
                    </h3>
                    <p className="bn mb-5 text-gray-600 leading-loose text-sm">
                      {posts[0].description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <CalendarDays size={13} />
                      <span className="bn">{toBanglaDate(posts[0].date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      )}

      {/* ══════════════════ সকল কার্যক্রম ══════════════════ */}
      <div className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                কার্যক্রমের তালিকা
              </span>
              <h2 className="bn text-3xl font-black text-gray-900">সকল কার্যক্রম ও উদ্যোগ</h2>
              <p className="bn mx-auto mt-4 max-w-xl text-gray-500 leading-loose">
                প্রতিটি কার্যক্রমের পেছনে আছে সদস্যদের অক্লান্ত পরিশ্রম ও মানুষের প্রতি ভালোবাসা।
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {(posts.length > 1 ? posts.slice(1) : posts).map((post, i) => (
              <FadeIn key={post._id} delay={i * 80}>
                <article className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden" style={{ height: "210px" }}>
                    <img
                      src={post.image || "https://images.unsplash.com/photo-1593113630400-ea4288922559?w=600&q=80"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-gray-400 text-xs">
                      <CalendarDays size={12} />
                      <span className="bn">{toBanglaDate(post.date)}</span>
                    </div>
                    <div className="mb-3 h-0.5 w-10 rounded-full bg-emerald-500" />
                    <h3 className="bn mb-3 text-lg font-bold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="bn text-sm text-gray-500 leading-loose line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="rounded-2xl bg-gray-50 py-16 text-center">
              <p className="bn text-gray-400 text-lg">এখনো কোনো কার্যক্রমের তথ্য যোগ করা হয়নি।</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ গ্যালারি ══════════════════ */}
      <div className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-10 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                আমাদের মুহূর্তগুলো
              </span>
              <h2 className="bn text-3xl font-black text-gray-900">কার্যক্রমের ছবি</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80",
              "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80",
              "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80",
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
              "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=80",
              "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80",
              "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80",
              "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=400&q=80",
            ].map((src, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="overflow-hidden rounded-xl aspect-square">
                  <img
                    src={src}
                    alt={`কার্যক্রম ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ ভবিষ্যৎ পরিকল্পনা ══════════════════ */}
      <div className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-10 text-center">
              <span className="bn mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-600">
                সামনের দিন
              </span>
              <h2 className="bn text-3xl font-black text-gray-900">আমাদের ভবিষ্যৎ পরিকল্পনা</h2>
            </div>
          </FadeIn>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "🏥",
                title: "নিয়মিত স্বাস্থ্যসেবা",
                desc: "প্রতি তিন মাসে একবার বিনামূল্যে স্বাস্থ্য পরীক্ষার আয়োজন করার পরিকল্পনা রয়েছে।",
              },
              {
                icon: "📚",
                title: "শিক্ষা তহবিল",
                desc: "দরিদ্র পরিবারের মেধাবী শিক্ষার্থীদের জন্য একটি নিয়মিত বৃত্তি কার্যক্রম শুরু করা হবে।",
              },
              {
                icon: "🌱",
                title: "আয়বর্ধন প্রকল্প",
                desc: "দরিদ্র পরিবারের সক্ষম সদস্যদের জন্য ক্ষুদ্র উদ্যোক্তা প্রশিক্ষণ ও সহায়তা প্রদানের পরিকল্পনা।",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-7 text-center">
                  <p className="mb-4 text-4xl">{item.icon}</p>
                  <h3 className="bn mb-3 text-xl font-bold text-gray-800">{item.title}</h3>
                  <p className="bn text-sm text-gray-500 leading-loose">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ কল টু অ্যাকশন ══════════════════ */}
      <div
        className="px-4 py-20 text-center text-white"
        style={{ background: "linear-gradient(135deg, #022c22 0%, #065f46 60%, #059669 100%)" }}
      >
        <FadeIn>
          <h2 className="bn mb-5 text-3xl font-black md:text-4xl">
            আপনার সহায়তা দরকার?
          </h2>
          <p className="bn mx-auto mb-10 max-w-xl leading-loose text-emerald-200">
            সত্যিকারের সংকটে থাকলে আমাদের সাথে যোগাযোগ করুন। আমরা আপনার কথা শুনব
            এবং সাধ্যমতো পাশে থাকার চেষ্টা করব।
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/request-help"
              className="bn flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-lg transition hover:bg-emerald-50 hover:scale-105"
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
    </div>
  );
}
