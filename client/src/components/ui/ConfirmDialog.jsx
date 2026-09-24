import { useEffect } from 'react';
import AppIcon from './AppIcon';

// macOS alert sheet — replaces window.confirm()
const ConfirmDialog = ({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade items-center justify-center bg-black/25 p-6 backdrop-blur-[2px]"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div role="alertdialog" aria-modal="true" aria-label={title} className="mac-window w-full max-w-[280px] animate-pop rounded-2xl bg-elevated p-5 text-center">
        <AppIcon size="md" className="mx-auto" />
        <h3 className="mt-3 text-[13px] font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-2">{message}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
