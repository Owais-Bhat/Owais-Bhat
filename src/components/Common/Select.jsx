import { MdExpandMore } from 'react-icons/md';

export default function Select({
  label,
  error,
  className = '',
  required = false,
  options = [],
  placeholder,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full appearance-none
            bg-white border border-slate-200 rounded-lg
            px-4 py-2.5 pr-10
            text-slate-900 text-sm
            transition-all duration-200
            focus:outline-none focus:border-teal-700 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,124,123,0.12)]
            hover:border-slate-300 hover:bg-slate-50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/60' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-white text-slate-900">
                {label}
              </option>
            );
          })}
        </select>
        <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
