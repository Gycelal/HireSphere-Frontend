import { useEffect } from "react";

const AvatarLightbox = ({ src, initials, onClose }) => {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white shadow-lg transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[1.1rem]">close</span>
        </button>

        {/* Full-size image or initials */}
        <div className="w-64 h-64 rounded-3xl overflow-hidden bg-violet-100 dark:bg-violet-950 border-4 border-white dark:border-gray-800 shadow-2xl shadow-black/40 flex items-center justify-center">
          {src ? (
            <img
              src={src}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl font-bold text-violet-600 dark:text-violet-400 select-none">
              {initials}
            </span>
          )}
        </div>

        <p className="text-xs text-white/60">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  );
}

export default AvatarLightbox;
