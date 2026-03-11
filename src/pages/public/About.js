import React from "react";
import { Heart, Target, Eye } from "lucide-react";
import logo1 from "../assets/logo1.jpeg";

const members = [
  "আব্দুল করিম", "রহিমা বেগম", "শফিকুল ইসলাম", "ফাতেমা আক্তার",
  "হারুনুর রশিদ", "আলিয়া খাতুন", "জামাল উদ্দিন", "নাসরিন সুলতানা",
  "কামরুল হাসান", "তানিয়া আহমেদ", "ইমরান হোসেন", "সাদিয়া চৌধুরী",
  "মেহেদী হাসান", "নুসরাত জাহান", "রাজিব আহমেদ", "সুমাইয়া পারভীন",
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <img
          src={logo1}
          alt="বদর উদ্দিন বেপারী কল্যাণ সংস্থা"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-5 border-4 border-emerald-400 shadow-lg"
        />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">আমাদের সম্পর্কে</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          বদর উদ্দিন বেপারী কল্যাণ সংস্থার যাত্রা, লক্ষ্য ও মূল্যবোধ সম্পর্কে জানুন।
        </p>
      </div>

      {/* Story */}
      <section className="bg-white rounded-2xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">আমাদের গল্প</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ২০২৩ সালে, আমাদের পরিবারের ২০ জন সদস্য একত্রিত হয়ে সিদ্ধান্ত নেন যে আমরা একসাথে কিছু করতে পারি। প্রতি মাসে নির্দিষ্ট পরিমাণ অর্থ জমা করে আমরা একটি তহবিল গঠন করি এবং সেই তহবিল থেকে আমাদের আশেপাশের অসহায় মানুষদের সহায়তা করি।
        </p>
        <p className="text-gray-600 leading-relaxed">
          গত ২৪ মাসে আমরা শীতবস্ত্র বিতরণ, খাদ্য সহায়তা, চিকিৎসা সহায়তা এবং শিক্ষাবৃত্তি প্রদান করেছি। আমাদের এই ক্ষুদ্র প্রচেষ্টা অনেক মানুষের জীবনে ইতিবাচক পরিবর্তন আনতে সক্ষম হয়েছে।
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Target size={32} className="text-emerald-600" />, title: "আমাদের লক্ষ্য", desc: "সমাজের দুঃস্থ ও অসহায় মানুষদের জীবনমান উন্নয়নে সহায়তা করা এবং একটি সহানুভূতিশীল সমাজ গড়ে তোলা।" },
          { icon: <Eye size={32} className="text-emerald-600" />, title: "আমাদের দৃষ্টিভঙ্গি", desc: "এমন একটি সমাজ গড়া যেখানে প্রতিটি মানুষ তাদের মৌলিক চাহিদা পূরণ করতে সক্ষম এবং কেউ অসহায় থাকে না।" },
          { icon: <Heart size={32} className="text-emerald-600" />, title: "আমাদের মূল্যবোধ", desc: "স্বচ্ছতা, জবাবদিহিতা, সহানুভূতি এবং নিঃস্বার্থ সেবাই আমাদের মূল চালিকাশক্তি।" },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Member List */}
      <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">আমাদের সদস্য তালিকা</h2>
        <p className="text-gray-500 text-sm mb-6">স্বচ্ছতার জন্য আমরা আমাদের সদস্যদের নাম প্রকাশ করছি।</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {members.map((name, i) => (
            <div
              key={i}
              className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-emerald-800"
            >
              {name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
