import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function DonationLog() {

  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    try {
      const { data } = await api.get("/donations");
      setDonations(data);
    } catch {
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (

    <div>

      <div className="mb-6">

        <h1 className="text-2xl font-extrabold text-gray-800">
          অনুদানের তালিকা
        </h1>

        <p className="text-gray-500 text-sm">
          সদস্যদের দেওয়া অনুদানের তথ্য
        </p>

      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-3 text-left">নাম</th>
              <th className="p-3 text-left">পরিমাণ</th>
              <th className="p-3 text-left">তারিখ</th>

            </tr>

          </thead>

          <tbody>

            {donations.map((d) => (

              <tr key={d._id} className="border-t">

                <td className="p-3">{d.memberName}</td>

                <td className="p-3 text-emerald-600 font-semibold">
                  ৳{d.amount}
                </td>

                <td className="p-3">
                  {new Date(d.date).toLocaleDateString("bn-BD")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}