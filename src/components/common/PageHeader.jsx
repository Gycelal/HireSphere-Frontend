import { Link } from "react-router-dom";

/**
 * PageHeader
 *
 * Props:
 *   title          string   — page title (required)
 *   description    string   — subtitle / description (optional)
 *   showBackButton boolean  — show back arrow (optional, default false)
 *   onBack         function — called when back button is clicked (optional)
 *   backHref       string   — if provided, renders a <Link> instead of a button (optional)
 */
export default function PageHeader({
  title,
  description,
  showBackButton = false,
  onBack,
  backHref,
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      {showBackButton && (
        <div className="mb-2">
          {backHref ? (
            <Link
              to={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500
                hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit"
            >
              <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
              Back
            </Link>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500
                hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
              Back
            </button>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h1>

      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}