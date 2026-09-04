import type { PaymentStatus, BookingStatus } from './paymentTypes';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const paymentConfig: Record<PaymentStatus, { bg: string; text: string; dot: string; label: string }> = {
  success: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Success' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Failed' },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const cfg = paymentConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const bookingConfig: Record<BookingStatus, { bg: string; text: string; dot: string; label: string }> = {
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Accepted' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
  cancelled: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Cancelled' },
  completed: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500', label: 'Completed' },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const cfg = bookingConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
