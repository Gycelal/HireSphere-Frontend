import { forwardRef } from "react";

const TextInput = forwardRef(({ id, placeholder, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      placeholder={placeholder}
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-600
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
        transition-all duration-200"
    />
  );
});

export default TextInput;
