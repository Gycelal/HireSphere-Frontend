const StepBar = ({ current, steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const done   = current > step.id;
        const active = current === step.id;
        const last   = idx === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Bubble + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${done
                    ? "bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-300 dark:shadow-violet-900/40"
                    : active
                    ? "bg-white dark:bg-gray-950 border-violet-500 text-violet-600 dark:text-violet-400 shadow-sm"
                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600"
                  }`}
              >
                {done
                  ? <span className="material-symbols-outlined text-[0.95rem]">check</span>
                  : <span className="material-symbols-outlined text-[0.95rem]">{step.icon}</span>
                }
              </div>
              <span className={`text-[0.62rem] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200
                ${active ? "text-violet-600 dark:text-violet-400"
                  : done   ? "text-violet-400 dark:text-violet-500"
                  : "text-gray-400 dark:text-gray-600"}`}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!last && (
              <div className={`flex-1 h-0.5 mb-5 mx-2 rounded-full transition-colors duration-300
                ${done ? "bg-violet-500" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepBar;
