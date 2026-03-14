import React from "react";
import { Link } from "react-router-dom";
import bannerImg from "../../assets/banner.PNG";
import logoImg from "../../assets/logo.PNG";
import { ArrowRight } from "lucide-react";

export default function Home() {

  return (
    <div>

      <section
        className="relative min-h-screen flex items-center justify-center text-center text-white px-4"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl">

          <img
            src={logoImg}
            alt="logo"
            className="w-28 mx-auto mb-6 rounded-full border-4 border-white/40"
          />

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            আমরা সবসময় <br />
            অসহায় মানুষের <br />
            <span className="text-emerald-400">পাশে আছি</span>
          </h1>

          <p className="text-lg text-emerald-100 mb-10">
            গত ২৪ মাস ধরে আমরা একসাথে কাজ করে আশেপাশের অসহায় মানুষদের সাহায্য করে আসছি।
          </p>

          <div className="flex flex-wrap gap-4 justify-center">

            <Link
              to="/about"
              className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-lg flex items-center gap-2"
            >
              আমাদের সম্পর্কে জানুন
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/request-help"
              className="px-6 py-3 border border-white text-white rounded-lg"
            >
              সাহায্যের জন্য আবেদন করুন
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}