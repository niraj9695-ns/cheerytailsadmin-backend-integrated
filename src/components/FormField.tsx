import { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rightElement?: ReactNode;
  leftIcon?: ReactNode;
}

export default function FormField({
  label,
  error,
  hint,
  required,
  rightElement,
  leftIcon,
  id,
  className = '',
  ...rest
}: FormFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      <div className="relative group">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          placeholder=" "
          className={`
            peer w-full rounded-xl border bg-white text-slate-800
            ${leftIcon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-11' : 'pr-4'}
            pt-6 pb-2 text-sm
            transition-all duration-200 outline-none
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 hover:border-slate-300'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...rest}
        />

        <label
          htmlFor={inputId}
          className={`
            absolute pointer-events-none select-none transition-all duration-200
            ${leftIcon ? 'left-10' : 'left-4'}
            text-sm top-4
            peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium
            peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:font-medium
            ${
              error
                ? 'text-red-500 peer-focus:text-red-500 peer-[&:not(:placeholder-shown)]:text-red-500'
                : 'text-slate-400 peer-focus:text-sky-500 peer-[&:not(:placeholder-shown)]:text-slate-500'
            }
          `}
        >
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>

        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center z-10">
            {rightElement}
          </span>
        )}
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
