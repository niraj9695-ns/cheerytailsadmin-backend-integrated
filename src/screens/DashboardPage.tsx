import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CreditCard, AlertCircle } from 'lucide-react';
import PaymentSummaryCards from '../components/PaymentSummaryCards';
import PaymentActivityOverview from '../components/PaymentActivityOverview';
import PaymentTransactions from '../components/PaymentTransactions';
import PaymentReports from '../components/PaymentReports';
import PaymentSettings from '../components/PaymentSettings';
import type { PaymentSummary } from '../components/paymentTypes';
import { fetchPaymentDashboard, type PaymentDashboardData } from '../services/payments';

const emptySummary: PaymentSummary = {
  totalCollection: 0,
  todayCollection: 0,
  successfulPayments: 0,
  failedPayments: 0,
  pendingPayments: 0,
  totalRefunded: 0,
  pendingRefunds: 0,
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<PaymentSummary>(emptySummary);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDashboard = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data: PaymentDashboardData = await fetchPaymentDashboard();
      setSummary({
        totalCollection: data.totalCollection,
        todayCollection: data.todayCollection,
        successfulPayments: data.successfulPayments,
        failedPayments: data.failedPayments,
        pendingPayments: data.pendingPayments,
        totalRefunded: data.totalRefunded,
        pendingRefunds: data.pendingRefunds,
      });
      setCurrency(data.currency || 'INR');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment dashboard');
    } finally {
      if (showRefreshing) setIsRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  function handleRefresh() {
    loadDashboard(true);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="screen-enter space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600">
              <CreditCard size={20} />
            </span>
            Payments
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-12 sm:ml-0">
            Monitor collections, transactions, refunds and payment activity.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50"
            aria-label="Refresh payment data"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Dashboard error banner */}
      {error && !loading && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 animate-fade-in">
          <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Failed to load dashboard data</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => loadDashboard()}
            className="text-xs font-semibold text-red-700 hover:text-red-800 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <PaymentSummaryCards summary={summary} currency={currency} loading={loading} />

      {/* Payment Activity Overview */}
      <PaymentActivityOverview summary={summary} currency={currency} loading={loading} />

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Transactions</h2>
        <PaymentTransactions currency={currency} externalRefreshKey={refreshKey} />
      </div>

      {/* Revenue & GST Reports */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Revenue & GST Reports</h2>
        <PaymentReports currency={currency} />
      </div>

      {/* Payment Settings */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Payment Settings</h2>
        <PaymentSettings />
      </div>
    </div>
  );
}
