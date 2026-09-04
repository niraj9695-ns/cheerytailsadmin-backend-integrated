import { TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import type { PaymentSummary } from './paymentTypes';
import { formatCurrency } from './paymentTypes';

interface PaymentActivityOverviewProps {
  summary: PaymentSummary;
}

export default function PaymentActivityOverview({ summary }: PaymentActivityOverviewProps) {
  const total = summary.successfulPayments + summary.pendingPayments + summary.failedPayments || 1;
  const successPct = Math.round((summary.successfulPayments / total) * 100);
  const pendingPct = Math.round((summary.pendingPayments / total) * 100);
  const failedPct = Math.round((summary.failedPayments / total) * 100);

  const distribution = [
    { label: 'Successful', count: summary.successfulPayments, pct: successPct, color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', count: summary.pendingPayments, pct: pendingPct, color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Failed', count: summary.failedPayments, pct: failedPct, color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Simple 7-day mock collection trend
  const trendData = [
    { day: 'Mon', value: 320 },
    { day: 'Tue', value: 480 },
    { day: 'Wed', value: 260 },
    { day: 'Thu', value: 640 },
    { day: 'Fri', value: 890 },
    { day: 'Sat', value: 720 },
    { day: 'Sun', value: 410 },
  ];
  const maxTrend = Math.max(...trendData.map((d) => d.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Collection Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sky-500"><TrendingUp size={16} /></span>
          <h3 className="text-sm font-semibold text-slate-700">Collection Summary</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Total Collection</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalCollection)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Today</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{formatCurrency(summary.todayCollection)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Refunded</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{formatCurrency(summary.totalRefunded)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sky-500"><PieChart size={16} /></span>
          <h3 className="text-sm font-semibold text-slate-700">Payment Status Distribution</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
            <div className="bg-emerald-500" style={{ width: `${successPct}%` }} />
            <div className="bg-amber-500" style={{ width: `${pendingPct}%` }} />
            <div className="bg-red-500" style={{ width: `${failedPct}%` }} />
          </div>
          {distribution.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 tabular-nums">{item.count}</span>
                <span className="text-xs text-slate-400 tabular-nums">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Collection Trend (bar chart) */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sky-500"><BarChart3 size={16} /></span>
          <h3 className="text-sm font-semibold text-slate-700">Weekly Collection Trend</h3>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between gap-2 h-40">
            {trendData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-sky-400 to-blue-500 transition-all duration-300 hover:from-sky-500 hover:to-blue-600"
                    style={{ height: `${(d.value / maxTrend) * 100}%` }}
                    title={formatCurrency(d.value)}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
