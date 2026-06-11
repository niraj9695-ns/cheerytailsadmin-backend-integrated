import { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
  leftIcon?: ReactNode;
}

export default function InputField({
  label,
  error,
  rightElement,
  leftIcon,
  className = '',
  id,
  ...rest
}: InputFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400
            transition-all duration-200 outline-none
            ${leftIcon ? 'pl-10' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            }
            ${className}`}
          {...rest}
        />
        {rightElement && (
          <span className="absolute right-3.5 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-0.5 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
