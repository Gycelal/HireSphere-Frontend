// LandingPageBody.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Usage: Drop <LandingPageBody /> between <HireSphereNavbar /> and <HireSphereFooter />
// Requires:
//   - Tailwind CSS with darkMode: 'class'
//   - Google Material Symbols Outlined font
//   - Plus Jakarta Sans + DM Sans via Google Fonts
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared ────────────────────────────────────────────────────────────────────
function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ── Section 1: Hero ───────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-24 pb-28 sm:pt-32 sm:pb-36 transition-colors duration-300">
      {/* Ambient orbs */}
      <div className="absolute w-125 h-150 rounded-full bg-violet-400 -top-40 -left-32 blur-[80px] opacity-[0.10] dark:opacity-[0.06] pointer-events-none" />
      <div className="absolute w-125 h-150 rounded-full bg-violet-500 -bottom-20 -right-24 blur-[80px] opacity-[0.10] dark:opacity-[0.06] pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/70 border border-violet-100 dark:border-violet-900 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wide">
            AI-Powered · Now in Beta
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight max-w-3xl mb-6">
          Hire Smarter with{" "}
          <span className="text-violet-600 dark:text-violet-400">AI-Powered</span>{" "}
          Recruitment
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-10">
          AI-driven hiring platform that simplifies job matching, interviews, and analytics for modern teams.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          <a
            href="/jobs"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-lg shadow-violet-200 dark:shadow-violet-900/40"
          >
            Find Jobs <Icon name="search" className="text-[1.1rem]" />
          </a>
          <a
            href="/post-job"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-violet-600 dark:text-violet-400 border-2 border-violet-400 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200"
          >
            Post a Job <Icon name="add_circle" className="text-[1.1rem]" />
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {[
            { icon: "groups",   stat: "50K+",   label: "Candidates" },
            { icon: "business", stat: "2,000+", label: "Companies" },
            { icon: "verified", stat: "98%",    label: "Match Accuracy" },
          ].map(({ icon, stat, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <Icon name={icon} className="text-violet-500 text-[1.2rem]" />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{stat}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Features ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "psychology",
    title: "AI ATS Matching",
    desc: "Automatically evaluates resumes against job descriptions using AI — no manual screening needed.",
  },
  {
    icon: "score",
    title: "Job Match Score",
    desc: "Candidates see a 0–100 match score, missing skills, and actionable suggestions before applying.",
  },
  {
    icon: "videocam",
    title: "Video Interviews",
    desc: "Conduct live interviews with screen sharing support — no third-party tools required.",
  },
  {
    icon: "chat",
    title: "Real-time Chat",
    desc: "Seamless, instant messaging between recruiters and candidates throughout the hiring process.",
  },
  {
    icon: "bar_chart",
    title: "Analytics Dashboard",
    desc: "Powerful hiring insights, funnel metrics, and performance tracking in one place.",
  },
];

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 shadow-sm hover:shadow-lg hover:shadow-violet-100/60 dark:hover:shadow-violet-900/20 hover:-translate-y-1 transition-all duration-250">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40 transition-colors duration-200">
        <Icon name={icon} className="text-violet-600 dark:text-violet-400 text-[1.4rem]" />
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
      </div>
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-slate-50/70 dark:bg-gray-900/40 py-24 sm:py-28 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.15em] mb-3">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Everything you need to hire smarter
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            A complete recruitment suite — from AI matching to analytics — built for speed and precision.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: How It Works ───────────────────────────────────────────────────
const HOW_CANDIDATE = [
  { step: 1, label: "Create Profile",       desc: "Sign up and build your professional profile in minutes." },
  { step: 2, label: "Upload Resume",        desc: "Upload your resume and let AI parse your skills automatically." },
  { step: 3, label: "View Job Match Score", desc: "See your fit score before you even hit apply." },
  { step: 4, label: "Apply Smartly",        desc: "Apply to roles that align with your experience and goals." },
  { step: 5, label: "Attend Interview",     desc: "Join live video interviews with screen sharing built-in." },
];

const HOW_RECRUITER = [
  { step: 1, label: "Post Job",                 desc: "Create a detailed job listing with required skills in seconds." },
  { step: 2, label: "View ATS Scores",          desc: "AI ranks every applicant against your job description." },
  { step: 3, label: "Shortlist Candidates",     desc: "Filter, compare, and shortlist the best-fit profiles." },
  { step: 4, label: "Conduct Video Interviews", desc: "Run interviews directly on the platform — no Zoom needed." },
  { step: 5, label: "Hire Efficiently",         desc: "Close roles faster with data-driven hiring decisions." },
];

function StepItem({ step, label, desc, isLast }) {
  return (
    <div className={`relative flex gap-4 ${!isLast ? "pb-8" : ""}`}>
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-4.25 top-9 bottom-0 w-0.5 bg-linear-to-b from-violet-500/30 to-transparent" />
      )}
      {/* Badge */}
      <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold shadow-md shadow-violet-200 dark:shadow-violet-900/40 z-10">
        {step}
      </div>
      {/* Text */}
      <div className="pt-1.5">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 leading-snug">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepColumn({ title, icon, steps }) {
  return (
    <div className="flex flex-col gap-6 p-7 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900">
          <Icon name={icon} className="text-violet-600 dark:text-violet-400 text-[1.3rem]" />
        </div>
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h3>
      </div>
      <div>
        {steps.map((s, i) => (
          <StepItem key={s.step} {...s} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section className="bg-white dark:bg-gray-950 py-24 sm:py-28 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.15em] mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Simple steps. Powerful results.
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Whether you're looking for your next role or building your next team, we've made it effortless.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StepColumn title="For Candidates" icon="person_search"   steps={HOW_CANDIDATE} />
          <StepColumn title="For Recruiters"  icon="manage_accounts" steps={HOW_RECRUITER} />
        </div>
      </div>
    </section>
  );
}

// ── Section 4: CTA ────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-slate-50/70 dark:bg-gray-900/40 py-24 sm:py-28 transition-colors duration-300">
      {/* Orb */}
      <div className="absolute w-125 h-125 rounded-full bg-violet-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-[0.08] dark:opacity-[0.05] pointer-events-none" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "28px 28px" }}
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
          <a
            href="/register?role=candidate"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-lg shadow-violet-200 dark:shadow-violet-900/40"
          >
            Join as Candidate <Icon name="person_add" className="text-[1.1rem]" />
          </a>
          <a
            href="/register?role=recruiter"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-violet-600 dark:text-violet-400 border-2 border-violet-400 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200"
          >
            Join as Recruiter <Icon name="business_center" className="text-[1.1rem]" />
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8">
          {[
            { icon: "lock",   label: "No credit card required" },
            { icon: "cancel", label: "Cancel anytime" },
            { icon: "star",   label: "4.9 / 5 average rating" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
              <Icon name={icon} className="text-violet-400 dark:text-violet-600 text-[1rem]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function LandingPageBody() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}