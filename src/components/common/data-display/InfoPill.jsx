const InfoPill = ({ icon, text }) => {
  if (!text) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
      bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
      {icon && <span className="material-symbols-outlined text-[0.85rem] text-violet-500">{icon}</span>}
      {text}
    </span>
  );
};

export default InfoPill;
