import { memo } from 'react';

// macOS segmented control
const Segmented = memo(function Segmented({ options, value, onChange, ariaLabel, full = false }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`${full ? 'flex' : 'inline-flex'} rounded-lg bg-fill p-0.5`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`h-7 rounded-md px-3 text-[12px] font-medium whitespace-nowrap transition ${full ? 'flex-1' : ''} ${
              active
                ? 'bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.14),0_0_0_0.5px_rgb(0_0_0/0.06)] dark:bg-[#5a5a5f]'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
});

export default Segmented;
