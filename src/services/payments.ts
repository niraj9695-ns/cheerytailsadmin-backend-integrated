import { apiRequest } from '../lib/api';
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

export interface RevenueReport {
  type: 'daily' | 'monthly' | 'yearly';
  date: string;
  revenue: number;
  currency: string;
}

export interface GstReport {
  from: string;
  to: string;
  totalSales: number;
  totalGst: number;
  transactionCount: number;
  gstPercentage: number;
  currency: string;
}

export interface PaymentSettings {
  razorpayKeyId: string;
  gstPercentage: string;
  fixedAdvanceAmount: string;
  currency: string;
}

export interface PaymentSettingsUpdate extends PaymentSettings {
  razorpayKeySecret?: string;
}

interface RawPaymentSettings {
  razorpay_key_id: string;
  razorpay_key_secret?: string;
  gst_percentage: string | number;
  fixed_advance_amount: string | number;
  currency: string;
}

interface RawRevenueReport {
  type: 'daily' | 'monthly' | 'yearly';
  date: string;
  revenue: string | number;
  currency: string;
}

interface RawGstReport {
  from: string;
  to: string;
  total_sales: string | number;
  total_gst: string | number;
  transaction_count: string | number;
  gst_percentage: string | number;
  currency: string;
}

export interface RawTransaction {
  id: string | number;
  booking_id: string | number;
  user_id: string | number;
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
  if (s === 'refunded' || s === 'refund') return 'refunded';
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
  const res = await apiRequest<RawPaymentDashboard>('/api/admin/payments/dashboard', {}, true);
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

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const res = await apiRequest<RawPaymentSettings>('/api/admin/payments/settings', {}, true);
  return {
    razorpayKeyId: res.data.razorpay_key_id,
    gstPercentage: String(res.data.gst_percentage),
    fixedAdvanceAmount: String(res.data.fixed_advance_amount),
    currency: res.data.currency,
  };
}

export async function updatePaymentSettings(settings: PaymentSettingsUpdate): Promise<void> {
  const formData = new FormData();
  formData.append('razorpay_key_id', settings.razorpayKeyId);
  if (settings.razorpayKeySecret) {
    formData.append('razorpay_key_secret', settings.razorpayKeySecret);
  }
  formData.append('gst_percentage', settings.gstPercentage);
  formData.append('fixed_advance_amount', settings.fixedAdvanceAmount);
  formData.append('currency', settings.currency);

  await apiRequest<unknown>(
    '/api/admin/payments/settings',
    { method: 'POST', body: formData },
    true,
  );
}

export async function fetchRevenueReport(
  type: RevenueReport['type'],
  date: string,
): Promise<RevenueReport> {
  const params = new URLSearchParams({ type, date });
  const res = await apiRequest<RawRevenueReport>(
    `/api/admin/payments/reports/revenue?${params.toString()}`,
    {},
    true,
  );
  return {
    ...res.data,
    revenue: toNumber(res.data.revenue),
    currency: res.data.currency ?? 'INR',
  };
}

export async function fetchGstReport(from: string, to: string): Promise<GstReport> {
  const params = new URLSearchParams({ from, to });
  const res = await apiRequest<RawGstReport>(
    `/api/admin/payments/reports/gst?${params.toString()}`,
    {},
    true,
  );
  return {
    from: res.data.from,
    to: res.data.to,
    totalSales: toNumber(res.data.total_sales),
    totalGst: toNumber(res.data.total_gst),
    transactionCount: toNumber(res.data.transaction_count),
    gstPercentage: toNumber(res.data.gst_percentage),
    currency: res.data.currency ?? 'INR',
  };
}

export interface TransactionFilters {
  status?: PaymentStatus | '';
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

export async function fetchPaymentTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  params.set('status', filters.status ?? '');
  params.set('from', filters.from ?? '');
  params.set('to', filters.to ?? '');
  params.set('page', String(filters.page ?? 1));
  params.set('per_page', String(filters.perPage ?? 20));

  const query = params.toString();
  const path = `/api/admin/payments/transactions${query ? `?${query}` : ''}`;
  const res = await apiRequest<RawTransaction[]>(path, {}, true);
  return res.data.map(mapTransaction);
}
