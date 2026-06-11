import { useState } from 'react';
import { Search, Building2, Dog, Cat, Bird, Fish, MapPin, Grid3x3, DollarSign, Filter, X } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import CenterActionMenu from '../components/CenterActionMenu';
import Pagination from '../components/Pagination';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Center {
  id: string;
  center_name: string;
  center_type: 'dog' | 'cat' | 'bird' | 'fish' | 'pet';
  city: string;
  state: string;
  total_capacity: string;
  price_per_day: string;
  is_active: '0' | '1';
  created_at: string;
}

interface ManageCentersPageProps {
  onViewCenter?: (id: string) => void;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockCenters: Center[] = [
  { id: '7', center_name: 'Sunrise Pet Resort', center_type: 'dog', city: 'New York', state: 'NY', total_capacity: '50', price_per_day: '40', is_active: '1', created_at: '2026-05-27' },
  { id: '8', center_name: 'Paws & Claws Haven', center_type: 'cat', city: 'Los Angeles', state: 'CA', total_capacity: '35', price_per_day: '35', is_active: '1', created_at: '2026-05-26' },
  { id: '9', center_name: 'Feathered Friends Lodge', center_type: 'bird', city: 'Chicago', state: 'IL', total_capacity: '20', price_per_day: '28', is_active: '0', created_at: '2026-05-25' },
  { id: '10', center_name: 'Aquatic Paradise', center_type: 'fish', city: 'Miami', state: 'FL', total_capacity: '45', price_per_day: '50', is_active: '1', created_at: '2026-05-24' },
  { id: '11', center_name: 'Happy Tails Inn', center_type: 'dog', city: 'Seattle', state: 'WA', total_capacity: '60', price_per_day: '45', is_active: '1', created_at: '2026-05-23' },
  { id: '12', center_name: 'Whisker Wonderland', center_type: 'cat', city: 'Boston', state: 'MA', total_capacity: '30', price_per_day: '32', is_active: '0', created_at: '2026-05-22' },
  { id: '13', center_name: 'Pawsome Retreat', center_type: 'pet', city: 'Denver', state: 'CO', total_capacity: '70', price_per_day: '38', is_active: '1', created_at: '2026-05-21' },
  { id: '14', center_name: 'Bark Boulevard', center_type: 'dog', city: 'Austin', state: 'TX', total_capacity: '55', price_per_day: '42', is_active: '1', created_at: '2026-05-20' },
  { id: '15', center_name: 'Furry Friends Hotel', center_type: 'pet', city: 'Phoenix', state: 'AZ', total_capacity: '40', price_per_day: '36', is_active: '0', created_at: '2026-05-19' },
  { id: '16', center_name: 'Cozy Critters Corner', center_type: 'cat', city: 'Portland', state: 'OR', total_capacity: '25', price_per_day: '30', is_active: '1', created_at: '2026-05-18' },
  { id: '17', center_name: 'Wagging Tails Resort', center_type: 'dog', city: 'San Diego', state: 'CA', total_capacity: '80', price_per_day: '55', is_active: '1', created_at: '2026-05-17' },
  { id: '18', center_name: 'Purrfect Stays', center_type: 'cat', city: 'Atlanta', state: 'GA', total_capacity: '28', price_per_day: '34', is_active: '1', created_at: '2026-05-16' },
  { id: '19', center_name: 'Tweety Suites', center_type: 'bird', city: 'Dallas', state: 'TX', total_capacity: '18', price_per_day: '26', is_active: '0', created_at: '2026-05-15' },
  { id: '20', center_name: 'Fin Friends Spa', center_type: 'fish', city: 'Tampa', state: 'FL', total_capacity: '32', price_per_day: '48', is_active: '1', created_at: '2026-05-14' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const typeIcon: Record<string, React.ReactNode> = {
  dog: <Dog size={15} />,
  cat: <Cat size={15} />,
  bird: <Bird size={15} />,
  fish: <Fish size={15} />,
  pet: <Building2 size={15} />,
};

const typeLabel: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  bird: 'Bird',
  fish: 'Fish',
  pet: 'All Pets',
};

const typeColor: Record<string, string> = {
  dog: 'bg-sky-100 text-sky-700 border-sky-200',
  cat: 'bg-violet-100 text-violet-700 border-violet-200',
  bird: 'bg-amber-100 text-amber-700 border-amber-200',
  fish: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  pet: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(value: string) {
  return `$${parseInt(value).toLocaleString()}`;
}

function formatCapacity(value: string) {
  const num = parseInt(value);
  return `${num} ${num === 1 ? 'spot' : 'spots'}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManageCentersPage({ onViewCenter }: ManageCentersPageProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  // Filter logic
  const filtered = mockCenters.filter((c) => {
    const matchesSearch =
      c.center_name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || c.center_type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.is_active === '1') ||
      (statusFilter === 'suspended' && c.is_active === '0');
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilters = [typeFilter !== 'all' ? 1 : 0, statusFilter !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0);

  function handleView(id: string) {
    onViewCenter?.(id);
  }

  function handleApprove(id: string) {
    console.log('Approve center:', id);
  }

  function handleSuspend(id: string) {
    console.log('Suspend center:', id);
  }

  function clearFilters() {
    setTypeFilter('all');
    setStatusFilter('all');
  }

  return (
    <div className="screen-enter space-y-5">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Centers</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage, review and monitor all registered boarding centers.</p>
        </div>
      </div>

      {/* ── Card wrapper ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search centers, city, state…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Filter toggle */}
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

          <p className="text-xs text-slate-400 sm:text-right">
            {filtered.length} {filtered.length === 1 ? 'center' : 'centers'} found
          </p>
        </div>

        {/* ── Filters panel ── */}
        {showFilters && (
          <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/50 animate-fade-in">
            <div className="flex flex-wrap items-end gap-4">
              {/* Type filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Center Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                  <option value="pet">All Pets</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Clear filters */}
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

        {/* ── Content ── */}
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={5} columns={9} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 size={40} />}
            title={search || activeFilters > 0 ? 'No matching centers' : 'No centers yet'}
            message={
              search || activeFilters > 0
                ? 'Try adjusting your search terms or filters.'
                : 'Centers will appear here once added by owners.'
            }
          />
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0">
                  <tr>
                    {['ID', 'Center Name', 'Type', 'Location', 'Capacity', 'Price/Day', 'Status', 'Created', ''].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                            h ? 'text-left' : 'w-12'
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {paginated.map((center) => (
                    <tr
                      key={center.id}
                      className="bg-white hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700">#{center.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600">
                            <Building2 size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{center.center_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                            typeColor[center.center_type]
                          }`}
                        >
                          {typeIcon[center.center_type]}
                          {typeLabel[center.center_type]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {center.city}, {center.state}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">{formatCapacity(center.total_capacity)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">
                        {formatCurrency(center.price_per_day)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={center.is_active === '1' ? 'active' : 'suspended'} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(center.created_at)}</td>
                      <td className="px-2 py-3.5">
                        <CenterActionMenu
                          onView={() => handleView(center.id)}
                          onApprove={() => handleApprove(center.id)}
                          onSuspend={() => handleSuspend(center.id)}
                          isActive={center.is_active === '1'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Tablet view (md) ── */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-3 p-4">
                {paginated.map((center) => (
                  <div
                    key={center.id}
                    className="bg-white/90 border border-slate-100 rounded-xl p-4 space-y-3 hover:shadow-md hover:border-slate-200 transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-medium text-slate-400">#{center.id}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                              typeColor[center.center_type]
                            }`}
                          >
                            {typeIcon[center.center_type]}
                            {typeLabel[center.center_type]}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 truncate">{center.center_name}</h3>
                      </div>
                      <StatusBadge status={center.is_active === '1' ? 'active' : 'suspended'} />
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {center.city}, {center.state}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Grid3x3 size={12} className="text-slate-400" />
                        {center.total_capacity} spots
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign size={12} className="text-emerald-500" />
                        {center.price_per_day}/day
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">Created {formatDate(center.created_at)}</span>
                      <CenterActionMenu
                        onView={() => handleView(center.id)}
                        onApprove={() => handleApprove(center.id)}
                        onSuspend={() => handleSuspend(center.id)}
                        isActive={center.is_active === '1'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mobile cards ── */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((center) => (
                <div key={center.id} className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{center.center_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">#{center.id}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{formatDate(center.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <CenterActionMenu
                      onView={() => handleView(center.id)}
                      onApprove={() => handleApprove(center.id)}
                      onSuspend={() => handleSuspend(center.id)}
                      isActive={center.is_active === '1'}
                    />
                  </div>

                  {/* Location + Type row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
                        typeColor[center.center_type]
                      }`}
                    >
                      {typeIcon[center.center_type]}
                      {typeLabel[center.center_type]}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <MapPin size={12} className="text-slate-400" />
                      {center.city}, {center.state}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Grid3x3 size={13} className="text-slate-400" />
                      <span>
                        <strong className="text-slate-700">{center.total_capacity}</strong> spots
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <DollarSign size={13} className="text-emerald-500" />
                      <span>{center.price_per_day}/day</span>
                    </div>
                    <StatusBadge status={center.is_active === '1' ? 'active' : 'suspended'} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
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
    </div>
  );
}
