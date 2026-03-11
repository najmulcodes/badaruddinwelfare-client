import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { PageLoader } from "../../components/LoadingSpinner";
import { CalendarDays } from "lucide-react";

const fallbackPosts = [
  { _id: "1", title: "শীতবস্ত্র বিতরণ কর্মসূচি ২০২৩", date: "2023-12-25", description: "গত শীতে আমরা প্রায় ৫০০টি পরিবারের মাঝে কম্বল ও গরম কাপড় বিতরণ করেছি।", image: "https://placehold.co/600x400/16a34a/FFFFFF?text=Winter+Drive" },
  { _id: "2", title: "বিনামূল্যে স্বাস্থ্যসেবা ক্যাম্প", date: "2023-11-10", description: "আমাদের সংস্থার উদ্যোগে প্রায় ২০০ জন দুঃস্থ রোগীকে বিনামূল্যে চিকিৎসা প্রদান করা হয়েছে।", image: "https://placehold.co/600x400/3b82f6/FFFFFF?text=Health+Camp" },
  { _id: "3", title: "শিক্ষাবৃত্তি প্রদান অনুষ্ঠান", date: "2023-10-15", description: "এ বছর ২০ জন মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল ছাত্র-ছাত্রীকে শিক্ষাবৃত্তি প্রদান করা হয়েছে।", image: "https://placehold.co/600x400/059669/FFFFFF?text=Scholarship" },
  { _id: "4", title: "খাদ্য বিতরণ কার্যক্রম", date: "2023-09-20", description: "দুঃস্থ পরিবারের মাঝে খাদ্য সামগ্রী বিতরণ করা হয়েছে।", image: "https://placehold.co/600x400/f59e0b/FFFFFF?text=Food+Distribution" },
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">আমাদের কাজ ও অর্জন</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          আমাদের সর্বশেষ কার্যক্রম ও সামাজিক উদ্যোগ সম্পর্কে জানুন।
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
              src={post.image || "https://placehold.co/600x400/10b981/FFFFFF?text=News"}
              alt={post.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <div className="h-1 w-12 bg-emerald-500 rounded mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                <CalendarDays size={12} />
                {new Date(post.date).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
