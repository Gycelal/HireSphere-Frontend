const TagList = ({ tags }) => {
  if (!tags || tags.length === 0)
    return <span className="text-sm italic text-gray-400 dark:text-gray-500">Not provided</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t}
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold
            bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
            border border-violet-200 dark:border-violet-800">
          {t}
        </span>
      ))}
    </div>
  );
};

export default TagList;
