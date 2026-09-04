export type PaymentStatus = 'success' | 'pending' | 'failed';
export type BookingStatus = 'accepted' | 'pending' | 'rejected' | 'cancelled' | 'completed';
export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Other';

export interface Transaction {
  paymentId: string;
  bookingId: string;
  userId: string;
  invoiceNumber: string | null;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentSummary {
  totalCollection: number;
  todayCollection: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRefunded: number;
  pendingRefunds: number;
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
