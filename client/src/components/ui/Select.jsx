import { ChevronDownIcon } from '../Icons';

const Select = ({ className = '', children, ...props }) => (
  <div className={`relative ${className}`}>
    <select {...props} className="field cursor-pointer appearance-none pr-8">
      {children}
    </select>
    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-2" />
  </div>
);

export default Select;
