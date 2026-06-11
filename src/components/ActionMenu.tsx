import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, CheckCircle, Trash2 } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ActionMenuProps {
  onView?: () => void;
  onApprove?: () => void;
  onDelete?: () => void;
}

export default function ActionMenu({ onView, onApprove, onDelete }: ActionMenuProps) {
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
      ? [{ label: 'View Owner', icon: <Eye size={15} />, onClick: onView, variant: 'default' as const }]
      : []),
    ...(onApprove
      ? [
          {
            label: 'Approve Owner',
            icon: <CheckCircle size={15} />,
            onClick: onApprove,
            variant: 'default' as const,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: 'Delete Owner',
            icon: <Trash2 size={15} />,
            onClick: onDelete,
            variant: 'danger' as const,
          },
        ]
      : []),
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
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
