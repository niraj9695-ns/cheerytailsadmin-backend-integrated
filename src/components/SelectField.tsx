import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  required?: boolean;
}

export default function SelectField({
  label,
  options,
  error,
  hint,
  required,
  id,
  className = '',
  value,
  ...rest
}: SelectFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const hasValue = value !== '' && value !== undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative group">
        <select
          id={inputId}
          value={value}
          className={`
            peer w-full rounded-xl border bg-white text-slate-800
            pl-4 pr-10 pt-6 pb-2 text-sm appearance-none
            transition-all duration-200 outline-none cursor-pointer
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 hover:border-slate-300'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...rest}
        >
          <option value="" disabled hidden />
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label
          htmlFor={inputId}
          className={`
            absolute left-4 pointer-events-none select-none transition-all duration-200
            ${
              hasValue
                ? 'top-1.5 text-[11px] font-medium text-slate-500'
                : 'top-4 text-sm text-slate-400'
            }
            peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-sky-500
            ${error ? 'text-red-500 peer-focus:text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>

        <ChevronDown
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      <div className="flex items-start justify-between gap-2 min-h-[16px] px-1">
        {error ? (
          <p className="text-[11px] text-red-500 animate-fade-in">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-slate-400">{hint}</p>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
