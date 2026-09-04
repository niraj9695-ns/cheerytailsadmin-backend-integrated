import { useState } from 'react';
import { RefreshCw, CreditCard } from 'lucide-react';
import PaymentSummaryCards from '../components/PaymentSummaryCards';
import PaymentActivityOverview from '../components/PaymentActivityOverview';
import PaymentTransactions from '../components/PaymentTransactions';
import PaymentReports from '../components/PaymentReports';
import PaymentSettings from '../components/PaymentSettings';
import { mockPaymentSummary, mockTransactions } from '../components/paymentMockData';

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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

      {/* Summary Cards */}
      <PaymentSummaryCards summary={mockPaymentSummary} />

      {/* Payment Activity Overview */}
      <PaymentActivityOverview summary={mockPaymentSummary} />

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Transactions</h2>
        <PaymentTransactions
          transactions={mockTransactions}
          loading={false}
          error=""
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Revenue & GST Reports */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Revenue & GST Reports</h2>
        <PaymentReports />
      </div>

      {/* Payment Settings */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Payment Settings</h2>
        <PaymentSettings />
      </div>
    </div>
  );
}
