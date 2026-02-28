// HireSphereFooter.jsx
// Usage: <HireSphereFooter />
// Requires: Tailwind CSS (darkMode: 'class'), Google Material Symbols font

const FOOTER_LINKS = [
  { label: "About",          href: "/about" },
  { label: "Features",       href: "/features" },
  { label: "Pricing",        href: "/pricing" },
  { label: "Contact",        href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

function Logo() {
  return (
    <a href="/" className="inline-flex items-center gap-2 select-none group" aria-label="HireSphere home">
      <span className="flex items-center justify-center w-7 h-7">
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" strokeLinejoin="round" strokeLinecap="round">
          <circle cx="24" cy="24" r="18" stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="24"   y2="7.2"  stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="37.2" y2="14.4" stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="39.6" y2="29.5" stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="24"   y2="40.8" stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="10.8" y2="33.6" stroke="#A78BFA" strokeWidth="2.2"/>
          <line x1="24" y1="24" x2="8.4"  y2="18.5" stroke="#A78BFA" strokeWidth="2.2"/>
          <circle cx="24"   cy="7.2"  r="2.6" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="37.2" cy="14.4" r="3.2" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="39.6" cy="29.5" r="2.2" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="24"   cy="40.8" r="2.4" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="10.8" cy="33.6" r="2.4" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="8.4"  cy="18.5" r="2.0" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
          <circle cx="24"   cy="24"   r="5.2" fill="white" stroke="#A78BFA" strokeWidth="1.8"/>
        </svg>
      </span>
      <span className="text-[1.1rem] font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
        Hire<span className="text-violet-500">Sphere</span>
      </span>
    </a>
  );
}

export default function HireSphereFooter() {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-14">

        {/* ── Top Section ─────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          <Logo />
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
            AI-powered recruitment platform for smarter hiring.
          </p>
        </div>

        {/* ── Middle Section: Nav Links ───────────────────────── */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom Section ───────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <p className="text-xs text-gray-400 dark:text-gray-600 tracking-wide">
            © 2026 HireSphere. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}