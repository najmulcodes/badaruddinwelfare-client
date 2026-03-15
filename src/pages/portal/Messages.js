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
    } catch {
      toast.error("বার্তা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
  }, []);

  const handleSelect = async (message) => {
    setSelected(message);
    if (!message.isRead) {
      try {
        await api.patch(`/contact/${message._id}/read`);
        setMessages((prev) =>
          prev.map((item) => (item._id === message._id ? { ...item, isRead: true } : item))
        );
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
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">মেসেজগুলো</h1>
        <p className="text-gray-500 text-sm">ওয়েবসাইট থেকে পাঠানো মেসেজ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {messages.length ? (
            messages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleSelect(message)}
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer border-2 transition hover:shadow-md ${
                  selected?._id === message._id ? "border-emerald-500" : "border-transparent"
                } ${!message.isRead ? "border-l-4 border-l-blue-400" : ""}`}
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {message.isRead ? (
                      <MailOpen size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <Mail size={16} className="text-blue-500 shrink-0" />
                    )}
                    <p className={`font-semibold text-gray-800 text-sm truncate ${!message.isRead ? "font-bold" : ""}`}>
                      {message.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(message.createdAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1 break-all">{message.email}</p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{message.message}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
              কোনো বার্তা নেই
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 self-start md:sticky md:top-4">
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-lg">{selected.name}</p>
                <p className="text-gray-400 text-sm break-all">{selected.email}</p>
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(selected._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              {new Date(selected.createdAt).toLocaleString("bn-BD")}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {selected.message}
            </div>
            <a
              href={`mailto:${selected.email}?subject=RE: আপনার বার্তার উত্তর`}
              className="mt-4 inline-block w-full sm:w-auto text-center px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              ইমেইলে উত্তর দিন
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
