const GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-indigo-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-green-600',
  'from-teal-400 to-cyan-600',
];

const Avatar = ({ name = '', className = 'h-7 w-7 text-[11px]' }) => {
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || '?';
  const idx = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % GRADIENTS.length;

  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white ${GRADIENTS[idx]} ${className}`}
    >
      {initials}
    </span>
  );
};

export default Avatar;
