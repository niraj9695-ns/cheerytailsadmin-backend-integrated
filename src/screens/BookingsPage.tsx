import { useState, useEffect } from 'react';
import { CalendarCheck, Inbox, ArrowLeft, ChevronRight } from 'lucide-react';
import BookingSummaryCards from '../components/BookingSummaryCards';
import BookingFilters from '../components/BookingFilters';
import BookingTable from '../components/BookingTable';
import BookingCard from '../components/BookingCard';
import BookingSkeleton from '../components/BookingSkeleton';
import Pagination from '../components/Pagination';
import type { BookingStatus } from '../components/BookingStatusBadge';
import type { Booking } from '../components/bookingTypes';
import { fetchBookingsByOwner } from '../services/bookings';

interface BookingsPageProps {
  ownerId?: string;
  onBack?: () => void;
  onNavigateOwners?: () => void;
}

export default function BookingsPage({ ownerId, onBack, onNavigateOwners }: BookingsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      if (!ownerId) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await fetchBookingsByOwner(ownerId);
        if (!cancelled) {
          setBookings(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load bookings');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const scopedBookings = bookings;
  const ownerName = ownerId ? scopedBookings[0]?.owner_name ?? 'Owner' : '';

  const filtered = scopedBookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.pet.pet_name.toLowerCase().includes(q) ||
      b.customer.user_name.toLowerCase().includes(q) ||
      b.center.center_name.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const counts = {
    total: scopedBookings.length,
    accepted: scopedBookings.filter((b) => b.status === 'accepted').length,
    pending: scopedBookings.filter((b) => b.status === 'pending').length,
    cancelled: scopedBookings.filter((b) => b.status === 'cancelled').length,
  };

  async function refreshBookings() {
    if (!ownerId) return;
    setIsRefreshing(true);
    try {
      const data = await fetchBookingsByOwner(ownerId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh bookings');
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleView(id: string) {
    console.log('View booking:', id);
  }

  return (
    <div className="screen-enter space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          {ownerId && onBack && (
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2" aria-label="Breadcrumb">
              {onNavigateOwners && (
                <>
                  <button onClick={onNavigateOwners} className="hover:text-sky-500 transition-colors">
                    Manage Owners
                  </button>
                  <ChevronRight size={12} className="text-slate-300" />
                </>
              )}
              <span className="text-slate-600 font-medium truncate">{ownerName}</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-600 font-medium">Bookings</span>
            </nav>
          )}
          <div className="flex items-center gap-2.5">
            {ownerId && onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                aria-label="Back to owners"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600">
                <CalendarCheck size={20} />
              </span>
              Bookings
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-12 sm:ml-0">
            {ownerId
              ? `Boarding bookings received from ${ownerName}.`
              : 'Manage all boarding bookings received for your centers.'}
          </p>
        </div>
        <div className="hidden sm:block">
          <BookingFilters
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
            onRefresh={refreshBookings}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {loading ? (
        <BookingSkeleton variant="summary" />
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={() => {
              if (ownerId) {
                setLoading(true);
                setError('');
                fetchBookingsByOwner(ownerId)
                  .then((data) => setBookings(data))
                  .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load bookings'))
                  .finally(() => setLoading(false));
              }
            }}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="sm:hidden">
            <BookingFilters
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setCurrentPage(1);
              }}
              statusFilter={statusFilter}
              onStatusChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              onRefresh={refreshBookings}
              isRefreshing={isRefreshing}
            />
          </div>

          <BookingSummaryCards
            total={counts.total}
            accepted={counts.accepted}
            pending={counts.pending}
            cancelled={counts.cancelled}
          />

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Inbox size={30} className="text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">No bookings available</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Bookings received from customers will appear here.
                </p>
              </div>
            ) : (
              <>
                <BookingTable bookings={paginated} onView={handleView} />

                <div className="lg:hidden p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginated.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onView={handleView} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-100">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={filtered.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

