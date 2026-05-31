import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Input({
  label,
  error,
  hint,
  type = 'text',
  leftIcon: LeftIcon,
  className = '',
  required = false,
  wrapperClass = '',
  ...props
}) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPwd ? 'text' : 'password') : type;

  return (
    <div className={`${wrapperClass}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <span className="absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400 pointer-events-none">
            <LeftIcon className="w-5 h-5" />
          </span>
        )}
        <input
          type={resolvedType}
          className={`
            input-glass w-full
            ${error ? 'border-red-500/60 focus:border-red-400' : ''}
            ${LeftIcon ? 'pl-11' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            tabIndex={-1}
          >
            {showPwd
              ? <MdVisibilityOff className="w-4.5 h-4.5" />
              : <MdVisibility className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-slate-500 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}
