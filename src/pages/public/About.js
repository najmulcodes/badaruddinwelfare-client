import React from "react";
import logo1 from "../../assets/logo1.jpeg";
import memberLogo from "../../assets/member_logo.jpeg";

// ─── Member photo imports ───
import photoShahriyar  from "../../assets/shahriyar.jpg";
import photoAkbar      from "../../assets/akbar.jpg";
import photoAbuTaleb   from "../../assets/abu_taleb.jpg";
import photoAbuBakar   from "../../assets/abu_bakar.jpg";
import photoAbuSayed   from "../../assets/abu_sayed.jpg";
import photoAriful     from "../../assets/ariful.jpg";
import photoEkram      from "../../assets/ekram.jpg";
import photoOmar       from "../../assets/omar.jpg";
import photoParevej    from "../../assets/parevej.jpg";
import photoMamunur    from "../../assets/mamunur.jpg";
import photoMezbah     from "../../assets/mezbah.jpg";
import photoAlmgir     from "../../assets/almgir.jpg";
import photoMusa       from "../../assets/musa.jpg";
import photoShamsuddin from "../../assets/shamsuddin.jpg";
import photoRajib      from "../../assets/rajib.jpg";
import photoShariful   from "../../assets/shariful.jpg";

// ─── 16 Members — শাহরিয়ার first ───
const MEMBERS = [
  { id: 1,  name: "শাহরিয়ার",           photo: photoShahriyar  },
  { id: 2,  name: "আকবর হেসেন রিফাত",   photo: photoAkbar      },
  { id: 3,  name: "আবু তালেব",           photo: photoAbuTaleb   },
  { id: 4,  name: "আবু বকর সিদ্দিক",     photo: photoAbuBakar   },
  { id: 5,  name: "আবু সায়েদ রিন",       photo: photoAbuSayed   },
  { id: 6,  name: "আরিফুল ইসলাম",        photo: photoAriful     },
  { id: 7,  name: "একরাম হেসেন রিদয়",    photo: photoEkram      },
  { id: 8,  name: "ওমর ফারুক",           photo: photoOmar       },
  { id: 9,  name: "পারেভেজ",             photo: photoParevej    },
  { id: 10, name: "মামুনুর রশীদ",         photo: photoMamunur   },
  { id: 11, name: "মেজবাহ উদ্দিন",        photo: photoMezbah    },
  { id: 12, name: "মোঃ আলমগীর",          photo: photoAlmgir    },
  { id: 13, name: "মোঃ মুসা",            photo: photoMusa      },
  { id: 14, name: "মোঃ সামসুউদ্দিন",      photo: photoShamsuddin},
  { id: 15, name: "রাজীব",               photo: photoRajib     },
  { id: 16, name: "শরীফুল ইসলাম",         photo: photoShariful  },
];

export default function AboutTemp() {
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

        {/* Members Grid */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
              আমাদের সদস্যবৃন্দ
            </h2>
            <p className="text-gray-500 text-sm mt-1 ml-3">
              আমাদের ১৬ জন সক্রিয় সদস্য
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {MEMBERS.map((m) => (
              <div
                key={m.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="aspect-square overflow-hidden bg-emerald-50">
                  <img
                    src={m.photo || memberLogo}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = memberLogo; }}
                  />
                </div>
                {/* Name */}
                <div className="p-3 text-center">
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{m.name}</p>
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium">সদস্য</p>
                </div>
              </div>
            ))}
          </div>
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