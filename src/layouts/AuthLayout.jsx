import { Outlet, Link } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      {/* ── Top Header ── */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <span className="relative flex items-center justify-center w-8 h-8">
            <img src="/icon.png" alt="icon" className="w-8 h-8" />
          </span>
          <span className="text-[1.2rem] font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
            Hire<span className="text-violet-500">Sphere</span>
          </span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle/>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 flex items-center justify-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-600 tracking-wide">
          © {new Date().getFullYear()} HireSphere. All rights reserved.
        </p>
      </footer>

    </div>
  );
}