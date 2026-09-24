import { memo } from 'react';

// Reminders-style smart tile. Memoized: only re-renders when its own value/active state changes.
const StatCard = memo(function StatCard({ listKey, label, value, icon: Icon, tint, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(listKey)}
      className={`card p-4 text-left transition duration-200 hover:-translate-y-0.5 ${active ? 'ring-2 ring-accent/70' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${tint}`}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-[28px] leading-none font-semibold tracking-tight tabular-nums">{value}</span>
      </div>
      <p className="mt-3 text-[13px] font-medium text-ink-2">{label}</p>
    </button>
  );
});

export default StatCard;
