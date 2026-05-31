const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-indigo-500 to-blue-400',
  'from-rose-500 to-pink-400',
];

function getGradient(name = '') {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'U';
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

export default function Avatar({
  name = '',
  src,
  size = 'md',
  className = '',
  rounded = 'rounded-xl',
}) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const gradient = getGradient(name);
  const initials = getInitials(name);

  return (
    <div
      className={`
        ${sizeClass} ${rounded} ${className}
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        font-semibold text-white shrink-0 overflow-hidden
      `}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display">{initials}</span>
      )}
    </div>
  );
}
