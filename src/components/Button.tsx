import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
}

export default function Button({
  children,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:active:scale-100',
    ghost:
      'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 active:scale-[0.98] focus-visible:ring-slate-400',
  };

  const sizes = 'px-6 py-3 text-sm sm:text-base';

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
