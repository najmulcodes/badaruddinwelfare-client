import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Code2 } from "lucide-react";
import logo from "../assets/logo2.png";

export default function Footer() {
  return (
    <footer
      style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
      className="text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-full object-contain bg-white/20 p-0.5"
            />
            <div>
              <h3 className="font-bold text-base leading-tight">
                বদর উদ্দিন বেপারী কল্যাণ সংস্থা
              </h3>
              <p className="text-emerald-200 italic text-xs">
                সেবা ও উন্নয়ন’ই আমাদের মূল লক্ষ্য
              </p>
            </div>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed">
            আমরা একটি পারিবারিক অলাভজনক সংস্থা। আমাদের লক্ষ্য হলো সমাজের অসহায় ও
            সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো।
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">গুরুত্বপূর্ণ লিংক</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["হোম", "/"],
              ["আমাদের সম্পর্কে", "/about"],
              ["আমাদের কাজ", "/our-work"],
              ["সাহায্যের আবেদন", "/request-help"],
              ["নিবন্ধন", "/register"],
              ["যোগাযোগ", "/contact"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-emerald-200 hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">যোগাযোগ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-emerald-100">
              <MapPin size={16} />
              রেলগেইট, ফাজিলপুর বাজার সংলগ্ন, ফেনী, বাংলাদেশ
            </li>
            <li className="flex items-center gap-2 text-emerald-100">
              <Phone size={16} />
              +880 1840 242 448
            </li>
            <li className="flex items-center gap-2 text-emerald-100">
              <Mail size={16} />
              najmulhasanshahin@gmail.com
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-emerald-400/40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p className="text-emerald-200">
            © {new Date().getFullYear()} বদর উদ্দিন বেপারী কল্যাণ সংস্থা
          </p>

          <p className="flex items-center gap-1.5 text-emerald-100">
            <Code2 size={14} />
            Developed by
            <a
              href="mailto:najmulhasanshahin@gmail.com"
              className="font-semibold text-white hover:text-emerald-200 transition"
            >
              Najmul Hasan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}