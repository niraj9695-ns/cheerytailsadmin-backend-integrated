import { adminApiRequest } from '../lib/api';
import type { Transaction, PaymentStatus, BookingStatus, PaymentMethod } from '../components/paymentTypes';

export interface RawPaymentDashboard {
  total_collection: string | number;
  today_collection: string | number;
  successful_payments: string | number;
  failed_payments: string | number;
  pending_payments: string | number;
  total_refunded: string | number;
  pending_refunds: string | number;
  currency: string;
}

export interface PaymentDashboardData {
  totalCollection: number;
  todayCollection: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRefunded: number;
  pendingRefunds: number;
  currency: string;
}

export interface RawTransaction {
  id: string;
  booking_id: string;
  user_id: string;
  invoice_number: string | null;
  payment_method: string;
  total_amount: string | number;
  advance_amount: string | number;
  status: string;
  paid_at: string | null;
  created_at: string;
  booking_status: string;
}

function toNumber(value: string | number): number {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

function normalizePaymentStatus(status: string): PaymentStatus {
  const s = status.toLowerCase();
  if (s === 'success' || s === 'successful' || s === 'paid') return 'success';
  if (s === 'pending' || s === 'processing') return 'pending';
  if (s === 'failed' || s === 'failure' || s === 'error') return 'failed';
  return 'pending';
}

function normalizeBookingStatus(status: string): BookingStatus {
  const s = status.toLowerCase();
  if (s === 'accepted' || s === 'confirmed') return 'accepted';
  if (s === 'pending' || s === 'requested') return 'pending';
  if (s === 'rejected' || s === 'declined') return 'rejected';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  if (s === 'completed') return 'completed';
  return 'pending';
}

function normalizePaymentMethod(method: string): PaymentMethod {
  const m = method.toLowerCase();
  if (m === 'upi') return 'UPI';
  if (m === 'card' || m === 'credit_card' || m === 'debit_card') return 'Card';
  if (m === 'net_banking' || m === 'netbanking' || m === 'net banking') return 'Net Banking';
  return 'Other';
}

function mapTransaction(raw: RawTransaction): Transaction {
  return {
    paymentId: String(raw.id),
    bookingId: String(raw.booking_id),
    userId: String(raw.user_id),
    invoiceNumber: raw.invoice_number ?? null,
    paymentMethod: normalizePaymentMethod(raw.payment_method),
    totalAmount: toNumber(raw.total_amount),
    advanceAmount: toNumber(raw.advance_amount),
    paymentStatus: normalizePaymentStatus(raw.status),
    bookingStatus: normalizeBookingStatus(raw.booking_status),
    paidAt: raw.paid_at ?? null,
    createdAt: raw.created_at,
  };
}

export async function fetchPaymentDashboard(): Promise<PaymentDashboardData> {
  const res = await adminApiRequest<RawPaymentDashboard>('/api/admin/payments/dashboard');
  const d = res.data;
  return {
    totalCollection: toNumber(d.total_collection),
    todayCollection: toNumber(d.today_collection),
    successfulPayments: toNumber(d.successful_payments),
    failedPayments: toNumber(d.failed_payments),
    pendingPayments: toNumber(d.pending_payments),
    totalRefunded: toNumber(d.total_refunded),
    pendingRefunds: toNumber(d.pending_refunds),
    currency: d.currency ?? 'INR',
  };
}

export interface TransactionFilters {
  status?: PaymentStatus | '';
  from?: string;
  to?: string;
}

export async function fetchPaymentTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);

  const query = params.toString();
  const path = `/api/admin/payments/transactions${query ? `?${query}` : ''}`;
  const res = await adminApiRequest<RawTransaction[]>(path);
  return res.data.map(mapTransaction);
}
