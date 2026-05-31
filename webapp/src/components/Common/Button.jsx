import { MdLoop } from 'react-icons/md';

const VARIANTS = {
  primary: 'btn-primary focus:ring-2 focus:ring-teal-700/30 focus:ring-offset-2 focus:ring-offset-transparent',
  secondary: 'btn-secondary focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-transparent',
  danger: 'btn-danger focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:ring-offset-transparent',
  ghost: `bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100
          border border-transparent hover:border-slate-200
          rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-slate-300`,
  icon: `p-2 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all
         focus:outline-none focus:ring-2 focus:ring-slate-300`,
};

const SIZES = {
  xs: 'btn-sm !py-1.5 !px-3 !text-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  className = '',
  ...props
}) {
  const IconRight = iconRight;

  return (
    <button
      className={`
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading
        ? <MdLoop className="w-4 h-4 animate-spin shrink-0" />
        : Icon ? <Icon className="w-4 h-4 shrink-0" /> : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
