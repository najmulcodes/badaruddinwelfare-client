import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

export default function NewsManage() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const { data } = await api.get("/news");
    setPosts(data);
  };

  useEffect(() => { fetchPosts().finally(() => setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { toast.error("শিরোনাম ও বিবরণ প্রয়োজন"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (image) fd.append("image", image);
      await api.post("/news", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("পোস্ট প্রকাশিত হয়েছে!");
      setShowForm(false);
      setTitle(""); setDescription(""); setImage(null);
      fetchPosts();
    } catch { toast.error("প্রকাশ করতে সমস্যা হয়েছে"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই পোস্ট মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success("পোস্ট মুছে ফেলা হয়েছে");
      fetchPosts();
    } catch { toast.error("মুছতে সমস্যা হয়েছে"); }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">সংবাদ ব্যবস্থাপনা</h1>
          <p className="text-gray-500 text-sm">কার্যক্রম ও সংবাদ প্রকাশ করুন</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
            <Plus size={18} /> নতুন পোস্ট
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">শিরোনাম *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বিবরণ *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ছবি (ঐচ্ছিক)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60">
              {submitting ? "প্রকাশ হচ্ছে..." : "প্রকাশ করুন"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg">বাতিল</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts.length ? posts.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            {p.image && <img src={p.image} alt={p.title} className="w-24 h-20 object-cover rounded-lg shrink-0" />}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{p.title}</h3>
                {isAdmin && (
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 shrink-0 ml-2"><Trash2 size={16} /></button>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(p.date).toLocaleDateString("bn-BD")}</p>
            </div>
          </div>
        )) : <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">কোনো পোস্ট নেই</div>}
      </div>
    </div>
  );
}
