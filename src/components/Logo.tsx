import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-xl' },
  lg: { icon: 36, text: 'text-2xl' },
};

export default function Logo({ size = 'md' }: LogoProps) {
  const { icon, text } = sizeMap[size];
  return (
    <div className="flex items-center gap-2.5 justify-center">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-blue-500/30">
        <ShieldCheck size={icon} className="text-white" />
      </div>
      <span className={`font-bold tracking-tight text-slate-800 ${text}`}>
        Admin<span className="text-sky-500">Panel</span>
      </span>
    </div>
  );
}
