import { forwardRef } from "react";

const SelectInput = forwardRef(({ id, options, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        {...props}
        className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm appearance-none cursor-pointer
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none">
        expand_more
      </span>
    </div>
  );
});

export default SelectInput;
