const SIZES = {
  sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
  lg: 'h-16 w-16 [&>svg]:h-8 [&>svg]:w-8',
};

const AppIcon = ({ size = 'md', className = '' }) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center rounded-[26%] bg-linear-to-br from-[#5ac8fa] to-[#007aff] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_4px_12px_rgb(0_122_255/0.35)] ${SIZES[size]} ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  </span>
);

export default AppIcon;
