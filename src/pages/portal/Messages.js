import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Trash2, Mail, MailOpen } from "lucide-react";

export default function Messages() {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/contact");
      setMessages(data);
    } catch { toast.error("বার্তা লোড করতে সমস্যা হয়েছে"); }
  };

  useEffect(() => { fetchMessages().finally(() => setLoading(false)); }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await api.patch(`/contact/${msg._id}/read`);
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই বার্তা মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      setSelected(null);
      fetchMessages();
    } catch { toast.error("মুছতে সমস্যা হয়েছে"); }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">যোগাযোগের বার্তা</h1>
        <p className="text-gray-500 text-sm">ওয়েবসাইটের যোগাযোগ ফর্ম থেকে আসা বার্তাসমূহ</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-2">
          {messages.length ? messages.map((m) => (
            <div
              key={m._id}
              onClick={() => handleSelect(m)}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer border-2 transition hover:shadow-md ${selected?._id === m._id ? "border-emerald-500" : "border-transparent"} ${!m.isRead ? "border-l-4 border-l-blue-400" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {m.isRead ? <MailOpen size={16} className="text-gray-400" /> : <Mail size={16} className="text-blue-500" />}
                  <p className={`font-semibold text-gray-800 text-sm ${!m.isRead ? "font-bold" : ""}`}>{m.name}</p>
                </div>
                <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString("bn-BD")}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">{m.email}</p>
              <p className="text-gray-500 text-sm mt-1 line-clamp-1">{m.message}</p>
            </div>
          )) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">কোনো বার্তা নেই</div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="bg-white rounded-xl shadow-md p-6 self-start sticky top-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-gray-800 text-lg">{selected.name}</p>
                <p className="text-gray-400 text-sm">{selected.email}</p>
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(selected._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">{new Date(selected.createdAt).toLocaleString("bn-BD")}</p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
            <a
              href={`mailto:${selected.email}?subject=RE: আপনার বার্তার উত্তর`}
              className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              ইমেইলে উত্তর দিন
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
