const SectionCard = ({ title, icon, children }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-symbols-outlined text-[1.1rem] text-violet-500">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      {/* Section body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default SectionCard;
