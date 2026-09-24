import React from 'react';
export default function ApplyBottomBar({
  icon = 'task_alt',
  title = 'Selected Resume',
  subtitle = '',
  isActive = true,
  children,
  className = '',
}) {
  return (
    <div
      className={`sticky bottom-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5 shadow-xl shadow-gray-900/5 dark:shadow-black/40 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}
          >
            <span className="material-symbols-outlined text-[1.3rem]">{icon}</span>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{title}</p>
            <p
              className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md"
              title={subtitle || ''}
            >
              {subtitle || 'None'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
