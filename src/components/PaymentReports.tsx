import { useState } from 'react';
import { FileBarChart, Receipt, ChevronDown, Download } from 'lucide-react';
import { formatCurrency } from './paymentTypes';

export default function PaymentReports() {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [reportDate, setReportDate] = useState('');
  const [gstFrom, setGstFrom] = useState('');
  const [gstTo, setGstTo] = useState('');

  // Mock report data
  const revenueData = {
    daily: { revenue: 4260, period: reportDate || 'Today' },
    monthly: { revenue: 38450, period: 'September 2026' },
    yearly: { revenue: 452300, period: '2026' },
  };
  const current = revenueData[reportType];

  const gstData = {
    totalSales: 38450,
    totalGst: 6921,
    transactionCount: 28,
    gstPercentage: 18,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Revenue Report */}
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
                  onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly' | 'yearly')}
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
                type={reportType === 'daily' ? 'date' : reportType === 'monthly' ? 'month' : 'number'}
                placeholder="2026"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Revenue — {current.period}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(current.revenue)}</p>
            <p className="text-xs text-slate-500 mt-1">Currency: INR (₹)</p>
          </div>
          <button className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={15} />
            Download Report
          </button>
        </div>
      </div>

      {/* GST Report */}
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
                onChange={(e) => setGstFrom(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={gstTo}
                onChange={(e) => setGstTo(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Sales</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{formatCurrency(gstData.totalSales)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total GST</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{formatCurrency(gstData.totalGst)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Transactions</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{gstData.transactionCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">GST Rate</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{gstData.gstPercentage}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Currency: INR (₹)</p>
            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:from-sky-400 hover:to-blue-500 transition-all active:scale-[0.98]">
              <Receipt size={15} />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
