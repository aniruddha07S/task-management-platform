import { useEffect } from 'react';
import TrafficLights from './TrafficLights';

// A macOS-style window: title bar with traffic lights, scrollable body, optional footer.
const Modal = ({ title, onClose, children, footer, width = 'sm:max-w-lg' }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade items-end justify-center bg-black/25 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`mac-window flex max-h-[92vh] w-full animate-pop flex-col overflow-hidden rounded-t-2xl bg-elevated sm:rounded-2xl ${width}`}
      >
        <div className="relative flex h-11 shrink-0 items-center border-b border-line px-4">
          <TrafficLights onClose={onClose} />
          <h2 className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-ink">
            {title}
          </h2>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-line bg-canvas/60 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
