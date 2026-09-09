import React from 'react';

export default function ResumeSelectCard({
  resume,
  isSelected = false,
  onSelect,
  badgeLabel,
  badgeVariant = 'gray',
}) {
  const fileName = resume?.file_name || resume?.name || 'Resume.pdf';
  const fileUrl = resume?.file_url || resume?.url || '#';
  const isPdf = fileName.toLowerCase().endsWith('.pdf');

  const badgeStyles = {
    violet: 'bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    blue: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    emerald: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  };

  return (
    <div
      onClick={() => onSelect && onSelect(resume)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect && onSelect(resume);
        }
      }}
      className={`group relative flex items-center justify-between gap-4 p-4.5 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none
        ${
          isSelected
            ? 'border-violet-600 dark:border-violet-500 bg-violet-50/70 dark:bg-violet-950/30 shadow-md shadow-violet-500/10 dark:shadow-violet-950/50 ring-2 ring-violet-500/20'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Radio */}
        <div className="shrink-0 flex items-center justify-center">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${
                isSelected
                  ? 'border-violet-600 dark:border-violet-500 bg-violet-600 dark:bg-violet-500'
                  : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-gray-400 dark:group-hover:border-gray-500'
              }
            `}
          >
            {isSelected && (
              <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-950 block" />
            )}
          </div>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200
            ${
              isSelected
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                : 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 group-hover:bg-violet-200/80 dark:group-hover:bg-violet-900/60'
            }
          `}
        >
          <span className="material-symbols-outlined text-[1.4rem]">
            {isPdf ? 'picture_as_pdf' : 'description'}
          </span>
        </div>

        {/* File Info */}
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`text-sm sm:text-base font-semibold truncate max-w-[220px] sm:max-w-md md:max-w-lg transition-colors duration-200
                ${isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-gray-900 dark:text-white'}
              `}
              title={fileName}
            >
              {fileName}
            </p>

            {badgeLabel && (
              <span
                className={`text-[0.7rem] font-medium px-2 py-0.5 rounded-full border ${
                  badgeStyles[badgeVariant] || badgeStyles.gray
                }`}
              >
                {badgeLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{isPdf ? 'PDF Document' : 'Word Document'}</span>
            {(resume?.created_at || resume?.uploaded_at) && (
              <>
                <span>•</span>
                <span>{new Date(resume.created_at || resume.uploaded_at).toLocaleDateString()}</span>
              </>
            )}
            {resume?.used_at && (
              <>
                <span>•</span>
                <span>Used {new Date(resume.used_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action: Open / Preview in new tab */}
      {fileUrl && fileUrl !== '#' && (
        <div className="shrink-0 pl-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Preview resume in new tab"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-violet-600 dark:text-gray-500 dark:hover:text-violet-400 hover:bg-violet-100/70 dark:hover:bg-violet-950/60 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[1.2rem]">
              open_in_new
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
