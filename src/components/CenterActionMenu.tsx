import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, CheckCircle, Ban } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'success' | 'danger';
}

interface CenterActionMenuProps {
  onView?: () => void;
  onApprove?: () => void;
  onSuspend?: () => void;
  isActive?: boolean;
}

export default function CenterActionMenu({
  onView,
  onApprove,
  onSuspend,
  isActive = true,
}: CenterActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions: ActionItem[] = [
    ...(onView
      ? [{ label: 'View Center', icon: <Eye size={15} />, onClick: onView, variant: 'default' as const }]
      : []),
    ...(onApprove && !isActive
      ? [
          {
            label: 'Approve Center',
            icon: <CheckCircle size={15} />,
            onClick: onApprove,
            variant: 'success' as const,
          },
        ]
      : []),
    ...(onSuspend && isActive
      ? [
          {
            label: 'Suspend Center',
            icon: <Ban size={15} />,
            onClick: onSuspend,
            variant: 'danger' as const,
          },
        ]
      : []),
  ];

  const buttonColor = isActive
    ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
    : 'text-amber-400 hover:text-amber-600 hover:bg-amber-50';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${buttonColor}`}
        aria-label="Actions"
        aria-haspopup
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 origin-top-right animate-fade-in">
          <div className="rounded-lg bg-white shadow-lg shadow-slate-200/60 border border-slate-100 py-1">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  action.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : action.variant === 'success'
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
