const FieldLabel = ({ htmlFor, children, required }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5"
    >
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export default FieldLabel;
