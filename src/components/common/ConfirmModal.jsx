import { useEffect, useRef } from "react";

/**
 * ConfirmModal
 *
 * Props:
 *   open        boolean              — controls visibility
 *   title       string               — modal heading
 *   message     string | ReactNode   — body text
 *   confirmText string               — confirm button label  (default "Confirm")
 *   cancelText  string               — cancel button label   (default "Cancel")
 *   onConfirm   () => void           — called on confirm
 *   onCancel    () => void           — called on cancel / close
 *   variant     "default" | "danger" | "success"  (default "default")
 */
export default function ConfirmModal({
  open        = false,
  title       = "Are you sure?",
  message     = "",
  confirmText = "Confirm",
  cancelText  = "Cancel",
  onConfirm,
  onCancel,
  variant     = "default",
}) {
  const confirmBtnRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onCancel?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  // Focus the confirm button when modal opens
  useEffect(() => {
    if (open) confirmBtnRef.current?.focus();
  }, [open]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  //Variant config
  const variantConfig = {
    default: {
      icon:        "help",
      iconBg:      "bg-gray-100 dark:bg-gray-800",
      iconColor:   "text-gray-500 dark:text-gray-400",
      confirmBtn:  "bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30",
    },
    success: {
      icon:        "check_circle",
      iconBg:      "bg-green-50 dark:bg-green-950/60",
      iconColor:   "text-green-600 dark:text-green-400",
      confirmBtn:  "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-md shadow-green-200 dark:shadow-green-900/30",
    },
    danger: {
      icon:        "error",
      iconBg:      "bg-red-50 dark:bg-red-950/60",
      iconColor:   "text-red-500 dark:text-red-400",
      confirmBtn:  "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-200 dark:shadow-red-900/30",
    },
  };

  const { icon, iconBg, iconColor, confirmBtn } = variantConfig[variant] ?? variantConfig.default;

  //Backdrop click handler
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onCancel?.();
  }

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-200"
    >
      {/* Panel */}
      <div className="relative w-full max-w-md
        bg-white dark:bg-gray-900
        rounded-2xl border border-gray-100 dark:border-gray-800
        shadow-2xl shadow-gray-300/40 dark:shadow-black/50
        p-6 flex flex-col gap-5"
      >
        {/* Close (X) button */}
        <button
          onClick={onCancel}
          aria-label="Close modal"
          className="absolute top-4 right-4
            w-8 h-8 flex items-center justify-center rounded-lg
            text-gray-400 dark:text-gray-500
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-gray-600 dark:hover:text-gray-300
            transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[1.1rem]">close</span>
        </button>

        {/* Icon + Title */}
        <div className="flex items-start gap-4 pr-8">
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl not-even:shrink-0 ${iconBg}`}>
            <span className={`material-symbols-outlined text-[1.4rem] ${iconColor}`}>{icon}</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h2
              id="confirm-modal-title"
              className="text-base font-bold tracking-tight text-gray-900 dark:text-white leading-snug"
            >
              {title}
            </h2>
            {message && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 -mx-6" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold
              text-gray-600 dark:text-gray-300
              bg-gray-100 dark:bg-gray-800
              hover:bg-gray-200 dark:hover:bg-gray-700
              active:bg-gray-300 dark:active:bg-gray-600
              transition-colors duration-150"
          >
            {cancelText}
          </button>

          {/* Confirm */}
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150 ${confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}