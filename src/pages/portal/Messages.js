import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Trash2, Mail } from "lucide-react";

export default function Messages() {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/messages");
      setMessages(data);
    } catch {
      toast.error("বার্তা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm("এই বার্তা মুছে ফেলবেন?")) return;

    try {
      await api.delete(`/messages/${id}`);
      toast.success("বার্তা মুছে ফেলা হয়েছে");
      fetchMessages();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        বার্তা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">
          যোগাযোগের বার্তা
        </h1>

        <p className="text-gray-500 text-sm">
          ওয়েবসাইটের যোগাযোগ ফর্ম থেকে আসা বার্তাগুলো
        </p>
      </div>

      {messages.length === 0 ? (

        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-400">
          এখন কোনো বার্তা নেই
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-4">

          {messages.map((msg) => (

            <div
              key={msg._id}
              className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
            >

              <div className="flex justify-between items-start mb-3">

                <div>
                  <p className="font-bold text-gray-800">
                    {msg.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {msg.email}
                  </p>
                </div>

                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {msg.message}
              </p>

              <a
                href={`mailto:${msg.email}`}
                className="inline-flex items-center gap-1 text-emerald-600 text-sm hover:underline"
              >
                <Mail size={14} />
                ইমেইলে উত্তর দিন
              </a>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}