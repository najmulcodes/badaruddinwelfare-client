import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Trash2, ExternalLink } from "lucide-react";

const STATUS_COLORS = {
  New: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function HelpRequests() {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchRequests = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await api.get("/help-requests", { params });
      setRequests(data);
    } catch {
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchRequests().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/help-requests/${id}/status`, { status });
      toast.success("স্ট্যাটাস পরিবর্তন হয়েছে");
      fetchRequests();
      if (selected?._id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই আবেদন মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/help-requests/${id}`);
      toast.success("মুছে ফেলা হয়েছে");
      setSelected(null);
      fetchRequests();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">সাহায্যের আবেদন</h1>
          <p className="text-gray-500 text-sm">মানুষের পাঠানো সাহায্যের আবেদন</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">সব স্ট্যাটাস</option>
          {["New", "Under Review", "Approved", "Rejected"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {requests.length ? (
            requests.map((request) => (
              <div
                key={request._id}
                onClick={() => setSelected(request)}
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer border-2 transition hover:shadow-md ${
                  selected?._id === request._id ? "border-emerald-500" : "border-transparent"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800">{request.fullName}</p>
                    <p className="text-xs text-gray-400 mt-0.5 break-words">
                      {request.phone} · {request.address}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[request.status]}`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{request.description}</p>
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(request.createdAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
              কোনো আবেদন পাওয়া যায়নি
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 self-start md:sticky md:top-4">
            <div className="flex justify-between items-start gap-3 mb-4">
              <h2 className="font-bold text-gray-800 text-lg">{selected.fullName}</h2>
              {isAdmin && (
                <button onClick={() => handleDelete(selected._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4 break-words">
              <p><strong>ফোন:</strong> {selected.phone}</p>
              <p><strong>ঠিকানা:</strong> {selected.address}</p>
              <p><strong>তারিখ:</strong> {new Date(selected.createdAt).toLocaleDateString("bn-BD")}</p>
            </div>
            <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 mb-4">{selected.description}</p>
            {selected.attachment && (
              <a
                href={selected.attachment}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-600 text-sm hover:underline mb-4"
              >
                <ExternalLink size={14} /> সংযুক্তি দেখুন
              </a>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">স্ট্যাটাস পরিবর্তন করুন</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {["New", "Under Review", "Approved", "Rejected"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
