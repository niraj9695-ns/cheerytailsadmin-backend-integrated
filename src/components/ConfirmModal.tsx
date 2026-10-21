import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Trash2, AlertTriangle, X, ShieldCheck, XCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalVariant = 'approve' | 'delete';
type ModalStatus = 'confirm' | 'loading' | 'success' | 'error';

interface ConfirmModalProps {
  isOpen: boolean;
  variant: ModalVariant;
  ownerName: string;
  /** Called when user confirms — return a rejected Promise to trigger error state */
  onConfirm: () => Promise<void>;
  onClose: () => void;
  onSuccess?: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const config = {
  approve: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    Icon: ShieldCheck,
    title: 'Approve Owner',
    message: (name: string) =>
      `Are you sure you want to approve ${name}? They will gain full access to the platform and receive a confirmation notification.`,
    actionLabel: 'Approve Owner',
    actionClass:
      'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-400/30 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-400/50',
    successTitle: 'Owner Approved!',
    successMessage: (name: string) => `${name} has been approved and can now access the platform.`,
    successIconBg: 'bg-emerald-100',
    successIconColor: 'text-emerald-600',
    SuccessIcon: CheckCircle2,
  },
  delete: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    Icon: Trash2,
    title: 'Delete Owner',
    message: (name: string) =>
      `Are you sure you want to delete ${name}? This action cannot be undone and all associated data will be permanently removed.`,
    actionLabel: 'Delete Owner',
    actionClass:
      'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-400/30 hover:from-red-400 hover:to-rose-500 hover:shadow-red-400/50',
    successTitle: 'Owner Deleted',
    successMessage: (name: string) => `${name} has been permanently removed from the platform.`,
    successIconBg: 'bg-red-100',
    successIconColor: 'text-red-600',
    SuccessIcon: CheckCircle2,
  },
} as const;

// ─── Focusable elements helper ────────────────────────────────────────────────

const FOCUSABLE = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConfirmModal({
  isOpen,
  variant,
  ownerName,
  onConfirm,
  onClose,
  onSuccess,
}: ConfirmModalProps) {
  const [status, setStatus] = useState<ModalStatus>('confirm');
  const [errorMsg, setErrorMsg] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const cfg = config[variant];

  // Reset state each time modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('confirm');
      setErrorMsg('');
    }
  }, [isOpen]);

  // Body scroll lock + Escape key
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && status !== 'loading') onClose();

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, status, onClose]);

  // Auto-focus first button when modal opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const el = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
      el?.focus();
    }
  }, [isOpen, status]);

  async function handleConfirm() {
    setStatus('loading');
    try {
      await onConfirm();
      setStatus('success');
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => status === 'confirm' && onClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-slate-900/20 modal-enter overflow-hidden"
      >
        {/* ── Confirm state ────────────────────────────────────── */}
        {(status === 'confirm' || status === 'error') && (
          <>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-7">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${cfg.iconBg} flex items-center justify-center mb-5`}>
                <cfg.Icon size={26} className={cfg.iconColor} />
              </div>

              {/* Title */}
              <h2 id="modal-title" className="text-xl font-bold text-slate-900 mb-2">
                {cfg.title}
              </h2>

              {/* Delete-specific warning banner */}
              {variant === 'delete' && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                  <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-red-700">This action cannot be undone.</p>
                </div>
              )}

              {/* Message */}
              <p className="text-sm text-slate-600 leading-relaxed mb-1">
                {cfg.message(ownerName)}
              </p>

              {/* Owner name highlight */}
              <p className="text-sm font-semibold text-slate-800 mb-5">
                Owner:{' '}
                <span className={variant === 'delete' ? 'text-red-600' : 'text-emerald-700'}>
                  {ownerName}
                </span>
              </p>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 animate-fade-in">
                  <XCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Action failed</p>
                    <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ${cfg.actionClass} ${
                    variant === 'approve'
                      ? 'focus-visible:ring-emerald-500'
                      : 'focus-visible:ring-red-500'
                  }`}
                >
                  {status === 'error' ? 'Try Again' : cfg.actionLabel}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Loading state ─────────────────────────────────────── */}
        {status === 'loading' && (
          <div className="p-8 flex flex-col items-center justify-center gap-5 min-h-[220px]">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl ${cfg.iconBg} flex items-center justify-center`}>
                <cfg.Icon size={28} className={`${cfg.iconColor} opacity-40`} />
              </div>
              <span
                className={`absolute -inset-1.5 rounded-[22px] border-2 border-t-transparent animate-spin ${
                  variant === 'approve' ? 'border-emerald-400' : 'border-red-400'
                }`}
              />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-800">
                {variant === 'approve' ? 'Approving Owner…' : 'Deleting Owner…'}
              </p>
              <p className="text-sm text-slate-500 mt-1">Please wait, this won't take long.</p>
            </div>
          </div>
        )}

        {/* ── Success state ─────────────────────────────────────── */}
        {status === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center gap-5 min-h-[220px] text-center">
            <div
              className={`w-16 h-16 rounded-2xl ${cfg.successIconBg} flex items-center justify-center modal-success-icon`}
            >
              <cfg.SuccessIcon size={32} className={cfg.successIconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{cfg.successTitle}</p>
              <p className="text-sm text-slate-500 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                {cfg.successMessage(ownerName)}
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden bg-slate-100`}>
              <div
                className={`h-full rounded-full ${
                  variant === 'approve' ? 'bg-emerald-400' : 'bg-red-400'
                }`}
                style={{ animation: 'progressFill 1.8s linear forwards' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
