const Field = ({ label, htmlFor, error, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-[12px] font-medium text-ink-2">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-[11px] font-medium text-mac-red">{error}</p>}
  </div>
);

export default Field;
