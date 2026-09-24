// macOS window controls. Red closes when onClose is given; otherwise decorative.
const Dot = ({ color }) => (
  <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color }} />
);

const TrafficLights = ({ onClose }) => (
  <div className="group relative z-10 flex items-center gap-2">
    {onClose ? (
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-3 w-3 items-center justify-center rounded-full border border-black/10 bg-[#ff5f57]"
      >
        <svg viewBox="0 0 12 12" className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" stroke="currentColor" strokeWidth="1.6">
          <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
        </svg>
      </button>
    ) : (
      <Dot color="#ff5f57" />
    )}
    <Dot color="#febc2e" />
    <Dot color="#28c840" />
  </div>
);

export default TrafficLights;
