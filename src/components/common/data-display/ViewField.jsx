const ViewField = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2 py-2">
        {icon && (
          <span className="material-symbols-outlined text-[1rem] text-gray-400 dark:text-gray-500 shrink-0">
            {icon}
          </span>
        )}
        <span className="text-sm text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
          {value || (
            <span className="text-gray-400 dark:text-gray-600 italic">
              Not set
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default ViewField;
