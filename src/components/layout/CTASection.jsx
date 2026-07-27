import { Link } from "react-router-dom";
import { Icon } from "../../pages/LandingPage";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-slate-50/70 dark:bg-gray-900/40 py-24 sm:py-28 transition-colors duration-300">
      {/* Orb */}
      <div className="absolute w-125 h-125 rounded-full bg-violet-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-[0.08] dark:opacity-[0.05] pointer-events-none" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/70 border border-violet-100 dark:border-violet-900 mb-8">
          <Icon name="bolt" className="text-violet-500 text-[1rem]" />
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wide">
            Free to get started
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight max-w-2xl mb-5 leading-[1.15]">
          Get Started Today
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-10">
          Join HireSphere and transform the way you hire or get hired.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            to="/register?role=candidate"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-lg shadow-violet-200 dark:shadow-violet-900/40"
          >
            Join as Candidate{" "}
            <Icon name="person_add" className="text-[1.1rem]" />
          </Link>
          <Link
            to="/register?role=recruiter"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-lg shadow-violet-200 dark:shadow-violet-900/40"
          >
            Join as Recruiter{" "}
            <Icon name="business_center" className="text-[1.1rem]" />
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8">
          {[
            { icon: "lock", label: "No credit card required" },
            { icon: "cancel", label: "Cancel anytime" },
            { icon: "star", label: "4.9 / 5 average rating" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium"
            >
              <Icon
                name={icon}
                className="text-violet-400 dark:text-violet-600 text-[1rem]"
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
