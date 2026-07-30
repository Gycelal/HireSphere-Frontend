import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Logo() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  let homePath = "/";
  if (role === "candidate") {
    homePath = "/candidate/find-jobs";
  } else if (role === "recruiter") {
    homePath = "/recruiter/overview";
  } else if (role === "admin") {
    homePath = "/admin/dashboard";
  }

  return (
    <Link
      to={homePath}
      className="flex items-center gap-2 group select-none"
      aria-label="HireSphere Home"
    >
      <span className="relative flex items-center justify-center w-8 h-8">
        <img src="/icon.png" alt="icon" className="w-8 h-8" />
      </span>

      <span className="text-[1.2rem] font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
        Hire<span className="text-violet-500">Sphere</span>
      </span>
    </Link>
  );
}
