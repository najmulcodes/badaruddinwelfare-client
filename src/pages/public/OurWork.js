import React from "react";
import winterImg from "../../assets/winter.jpg";
import medicalImg from "../../assets/medical.jpg";
import foodImg from "../../assets/food.jpg";
import educationImg from "../../assets/education.jpg";

export default function OurWork() {

  const works = [
    {
      title: "শীতবস্ত্র বিতরণ",
      desc: "শীতকালে দরিদ্র মানুষের মাঝে শীতবস্ত্র বিতরণ করা হয়।",
      img: winterImg
    },
    {
      title: "চিকিৎসা সহায়তা",
      desc: "অসহায় রোগীদের চিকিৎসার জন্য আর্থিক সহায়তা দেওয়া হয়।",
      img: medicalImg
    },
    {
      title: "খাদ্য সহায়তা",
      desc: "অসহায় পরিবারকে খাদ্য সহায়তা প্রদান করা হয়।",
      img: foodImg
    },
    {
      title: "শিক্ষা সহায়তা",
      desc: "অভাবী শিক্ষার্থীদের পড়াশোনার জন্য সহায়তা করা হয়।",
      img: educationImg
    }
  ];

  return (

    <div className="max-w-6xl mx-auto px-4 py-12">

      <div className="text-center mb-12">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          আমাদের কাজ
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto">
          আমরা বিভিন্ন সামাজিক কাজের মাধ্যমে অসহায় মানুষের পাশে দাঁড়ানোর চেষ্টা করি।
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {works.map((w, i) => (

          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >

            <img
              src={w.img}
              alt={w.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {w.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {w.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}