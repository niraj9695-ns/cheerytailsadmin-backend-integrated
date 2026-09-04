import { useRef, useState } from 'react';
import { MoreVertical, Eye } from 'lucide-react';
import MenuDropdown from './MenuDropdown';

interface BookingActionMenuProps {
  onView?: () => void;
}

export default function BookingActionMenu({ onView }: BookingActionMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const actions = [
    ...(onView
      ? [{ label: 'View Booking', icon: <Eye size={15} />, onClick: onView }]
      : []),
  ];

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        aria-label="Booking actions"
        aria-haspopup
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      <MenuDropdown open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} width={160}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </MenuDropdown>
    </>
  );
}
