import { useState, useMemo } from 'react';
import { Search, Filter, X, Eye, RefreshCw, Inbox } from 'lucide-react';
import type { Transaction, PaymentStatus } from './paymentTypes';
import { formatCurrency, formatDateTime } from './paymentTypes';
import { PaymentStatusBadge, BookingStatusBadge } from './PaymentStatusBadge';
import Pagination from './Pagination';

interface PaymentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const methodIcon: Record<string, string> = {
  UPI: 'text-violet-600 bg-violet-50',
  Card: 'text-sky-600 bg-sky-50',
  'Net Banking': 'text-emerald-600 bg-emerald-50',
  Other: 'text-slate-600 bg-slate-50',
};

export default function PaymentTransactions({
  transactions,
  loading = false,
  error = '',
  onRefresh,
  isRefreshing = false,
}: PaymentTransactionsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        t.paymentId.toLowerCase().includes(q) ||
        t.bookingId.toLowerCase().includes(q) ||
        t.userId.toLowerCase().includes(q) ||
        (t.invoiceNumber ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || t.paymentStatus === statusFilter;
      const matchesFrom = !fromDate || new Date(t.createdAt) >= new Date(fromDate);
      const matchesTo = !toDate || new Date(t.createdAt) <= new Date(toDate + 'T23:59:59');
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [transactions, search, statusFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilters = [statusFilter !== 'all' ? 1 : 0, fromDate ? 1 : 0, toDate ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  );

  function clearFilters() {
    setStatusFilter('all');
    setFromDate('');
    setToDate('');
    setSearch('');
    setCurrentPage(1);
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search payment, booking, user, invoice…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 h-9 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilters > 0
                ? 'border-sky-300 bg-sky-50 text-sky-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={15} />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400">
            {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'}
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/50 animate-fade-in">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as PaymentStatus | 'all'); setCurrentPage(1); }}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
              />
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-4 bg-slate-200/70 rounded animate-pulse flex-1" />
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={onRefresh}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Inbox size={30} className="text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">No transactions found</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            {activeFilters > 0 || search
              ? 'Try adjusting your search terms or filters.'
              : 'Transactions will appear here once payments are processed.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  {['Payment ID', 'Booking ID', 'User ID', 'Invoice', 'Method', 'Total', 'Advance', 'Pay Status', 'Booking Status', 'Paid At', 'Created At', ''].map((h, i) => (
                    <th key={i} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h ? 'text-left' : 'w-12'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {paginated.map((t) => (
                  <tr key={t.paymentId} className="bg-white hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 font-mono">#{t.paymentId}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">#{t.bookingId}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">{t.userId}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{t.invoiceNumber ? t.invoiceNumber : '-'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${methodIcon[t.paymentMethod]}`}>
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-800">{formatCurrency(t.totalAmount)}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{formatCurrency(t.advanceAmount)}</td>
                    <td className="px-4 py-3.5"><PaymentStatusBadge status={t.paymentStatus} /></td>
                    <td className="px-4 py-3.5"><BookingStatusBadge status={t.bookingStatus} /></td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{t.paidAt ? formatDateTime(t.paidAt) : '-'}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{formatDateTime(t.createdAt)}</td>
                    <td className="px-2 py-3.5">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Actions">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet / mobile cards */}
          <div className="lg:hidden divide-y divide-slate-100">
            {paginated.map((t) => (
              <div key={t.paymentId} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 font-mono">#{t.paymentId}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Booking #{t.bookingId} · User {t.userId}</p>
                  </div>
                  <PaymentStatusBadge status={t.paymentStatus} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Invoice</p>
                    <p className="text-slate-600 font-medium">{t.invoiceNumber ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Method</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${methodIcon[t.paymentMethod]}`}>
                      {t.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400">Total</p>
                    <p className="text-slate-800 font-bold">{formatCurrency(t.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Advance</p>
                    <p className="text-slate-600 font-medium">{formatCurrency(t.advanceAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Booking Status</p>
                    <div className="mt-0.5"><BookingStatusBadge status={t.bookingStatus} /></div>
                  </div>
                  <div>
                    <p className="text-slate-400">Paid At</p>
                    <p className="text-slate-500">{t.paidAt ? formatDateTime(t.paidAt) : '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
