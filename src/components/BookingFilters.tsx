import { Search, Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import type { BookingStatus } from './BookingStatusBadge';

interface BookingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: BookingStatus | 'all';
  onStatusChange: (value: BookingStatus | 'all') => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const statusOptions: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export default function BookingFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
  isRefreshing = false,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-0 sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search booking, pet, customer…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-colors"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as BookingStatus | 'all')}
          className="h-10 pl-3 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 cursor-pointer appearance-none transition-colors min-w-[150px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      {/* Date filter (UI only) */}
      <div className="relative">
        <Calendar
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Date range"
          readOnly
          className="h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-400 cursor-pointer focus:outline-none focus:border-sky-400 transition-colors min-w-[140px]"
        />
      </div>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        aria-label="Refresh bookings"
      >
        <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}
