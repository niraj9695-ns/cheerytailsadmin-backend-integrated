import { useEffect, useState } from 'react';
import { FileBarChart, Receipt, ChevronDown, RefreshCw } from 'lucide-react';
import { formatCurrency } from './paymentTypes';
import {
  fetchGstReport,
  fetchRevenueReport,
  type GstReport,
  type RevenueReport,
} from '../services/payments';

interface PaymentReportsProps {
  currency?: string;
}

type ReportType = RevenueReport['type'];

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function PaymentReports({ currency = 'INR' }: PaymentReportsProps) {
  const today = localDateString(new Date());
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [reportDate, setReportDate] = useState(today);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState('');
  const [revenueRefreshKey, setRevenueRefreshKey] = useState(0);
  const [gstFrom, setGstFrom] = useState(`${today.slice(0, 7)}-01`);
  const [gstTo, setGstTo] = useState(today);
  const [gst, setGst] = useState<GstReport | null>(null);
  const [gstLoading, setGstLoading] = useState(true);
  const [gstError, setGstError] = useState('');
  const [gstRefreshKey, setGstRefreshKey] = useState(0);

  useEffect(() => {
    if (!reportDate) {
      setRevenueError('Select a date, month, or year to generate the revenue report.');
      setRevenueLoading(false);
      return;
    }

    let cancelled = false;
    setRevenueLoading(true);
    setRevenueError('');
    fetchRevenueReport(reportType, reportDate)
      .then((data) => {
        if (!cancelled) setRevenue(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRevenueError(error instanceof Error ? error.message : 'Failed to load revenue report');
        }
      })
      .finally(() => {
        if (!cancelled) setRevenueLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reportType, reportDate, revenueRefreshKey]);

  useEffect(() => {
    if (!gstFrom || !gstTo) {
      setGstError('Select both dates to generate the GST report.');
      setGstLoading(false);
      return;
    }
    if (gstFrom > gstTo) {
      setGstError('The start date must be on or before the end date.');
      setGstLoading(false);
      return;
    }

    let cancelled = false;
    setGstLoading(true);
    setGstError('');
    fetchGstReport(gstFrom, gstTo)
      .then((data) => {
        if (!cancelled) setGst(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setGstError(error instanceof Error ? error.message : 'Failed to load GST report');
        }
      })
      .finally(() => {
        if (!cancelled) setGstLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gstFrom, gstTo, gstRefreshKey]);

  function handleReportTypeChange(type: ReportType) {
    setReportType(type);
    const date = new Date();
    if (type === 'daily') {
      setReportDate(localDateString(date));
    } else if (type === 'monthly') {
      setReportDate(localDateString(date).slice(0, 7));
    } else {
      setReportDate(String(date.getFullYear()));
    }
  }

  function reportDateInputType(): string {
    if (reportType === 'daily') return 'date';
    if (reportType === 'monthly') return 'month';
    return 'number';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sky-500"><FileBarChart size={16} /></span>
          <h3 className="text-sm font-semibold text-slate-700">Revenue Report</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Report Type</label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(event) => handleReportTypeChange(event.target.value as ReportType)}
                  className="h-9 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer appearance-none"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {reportType === 'daily' ? 'Date' : reportType === 'monthly' ? 'Month' : 'Year'}
              </label>
              <input
                type={reportDateInputType()}
                min={reportType === 'yearly' ? '2000' : undefined}
                max={reportType === 'yearly' ? '2100' : undefined}
                placeholder="2026"
                value={reportDate}
                onChange={(event) => setReportDate(event.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100" aria-live="polite">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">
              Revenue{revenue ? ` — ${revenue.date}` : ''}
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {revenueLoading ? 'Loading…' : revenue ? formatCurrency(revenue.revenue, revenue.currency || currency) : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Currency: {revenue?.currency ?? currency}
            </p>
            {revenueError && <p role="alert" className="text-xs text-red-600 mt-2">{revenueError}</p>}
          </div>
          <button
            type="button"
            onClick={() => setRevenueRefreshKey((key) => key + 1)}
            disabled={revenueLoading}
            className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={revenueLoading ? 'animate-spin' : ''} />
            Refresh Report
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sky-500"><Receipt size={16} /></span>
          <h3 className="text-sm font-semibold text-slate-700">GST Report</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
              <input
                type="date"
                value={gstFrom}
                onChange={(event) => setGstFrom(event.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={gstTo}
                onChange={(event) => setGstTo(event.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
          {gstError && <p role="alert" className="text-xs text-red-600">{gstError}</p>}
          <div className="grid grid-cols-2 gap-3" aria-live="polite">
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Sales</p>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {gstLoading ? 'Loading…' : gst ? formatCurrency(gst.totalSales, gst.currency || currency) : '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total GST</p>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {gstLoading ? 'Loading…' : gst ? formatCurrency(gst.totalGst, gst.currency || currency) : '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Transactions</p>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {gstLoading ? 'Loading…' : gst?.transactionCount.toLocaleString() ?? '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">GST Rate</p>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {gstLoading ? 'Loading…' : gst ? `${gst.gstPercentage}%` : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Currency: {gst?.currency ?? currency}</p>
            <button
              type="button"
              onClick={() => setGstRefreshKey((key) => key + 1)}
              disabled={gstLoading || !gstFrom || !gstTo || gstFrom > gstTo}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:from-sky-400 hover:to-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw size={15} className={gstLoading ? 'animate-spin' : ''} />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
