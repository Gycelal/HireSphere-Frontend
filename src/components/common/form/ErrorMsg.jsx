const ErrorMsg = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-[0.7rem] text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
      <span className="material-symbols-outlined text-[0.8rem]">error</span>
      {message}
    </p>
  );
};

export default ErrorMsg;
