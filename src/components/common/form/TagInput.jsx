import { useState, useRef } from "react";

// ── TagInput ──────────────────────────────────────────────────────────────────
// Generic tag/pill input. Pass any array of strings via `tags` and receive
// updates via `onChange`. Works in both view-only and editing modes.
//
// Props:
//   tags        – string[]   current list of tags
//   onChange    – (tags: string[]) => void
//   isEditing   – boolean    show the interactive input when true
//   placeholder – string     optional placeholder for the text input
const TagInput = ({
  tags = [],
  onChange,
  isEditing = false,
  placeholder = "Type a value and press Enter or comma…",
}) => {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const addTag = (val) => {
    const trimmed = val.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputVal("");
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // ── View mode ──
  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
                border border-violet-200 dark:border-violet-800"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-600 italic">Not set</span>
        )}
      </div>
    );
  }

  // ── Edit mode ──
  return (
    <div
      className="flex flex-wrap gap-2 w-full min-h-[44px] px-3 py-2 rounded-xl
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent
        transition-all duration-200 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
            border border-violet-200 dark:border-violet-800"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="ml-0.5 text-violet-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <span className="material-symbols-outlined text-[0.85rem]">close</span>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputVal.trim() && addTag(inputVal)}
        placeholder={tags.length === 0 ? placeholder : "Add more…"}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-600 outline-none"
      />
    </div>
  );
};

export default TagInput;
