import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface MenuDropdownProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  width?: number;
}

export default function MenuDropdown({
  open,
  onClose,
  triggerRef,
  children,
  width = 176,
}: MenuDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const menuEl = menuRef.current;
      if (!trigger || !menuEl) return;

      const rect = trigger.getBoundingClientRect();
      const menuHeight = menuEl.offsetHeight;
      const gap = 4;

      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

      let top = openUp ? rect.top - menuHeight - gap : rect.bottom + gap;
      let left = rect.right - width;

      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - menuHeight - 8));

      setStyle({
        position: 'fixed',
        top,
        left,
        width,
        zIndex: 9999,
        visibility: 'visible',
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, triggerRef, width, children]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onClose();
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div ref={menuRef} style={style} className="animate-fade-in">
      <div className="rounded-lg bg-white shadow-lg shadow-slate-200/60 border border-slate-100 py-1">
        {children}
      </div>
    </div>,
    document.body,
  );
}
