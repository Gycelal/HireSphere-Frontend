import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import Logo from "../components/common/Logo";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      {/* auth navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Logo/>
        <ThemeToggle/>
      </header>

      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      
      <footer className="py-5 flex items-center justify-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-600 tracking-wide">
          © {new Date().getFullYear()} HireSphere. All rights reserved.
        </p>
      </footer>

    </div>
  );
}