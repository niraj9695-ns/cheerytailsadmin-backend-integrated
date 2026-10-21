import { MapPin, ArrowDown, Dog, Cat, Bird, Fish, PawPrint } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import BookingActionMenu from './BookingActionMenu';
import { type Booking, formatBookingDate, formatBookingCurrency } from './bookingTypes';

interface BookingTableProps {
  bookings: Booking[];
  onView?: (id: string) => void;
}

const petTypeIcon: Record<string, React.ReactNode> = {
  Dog: <Dog size={13} />,
  Cat: <Cat size={13} />,
  Bird: <Bird size={13} />,
  Fish: <Fish size={13} />,
};

function petInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export default function BookingTable({ bookings, onView }: BookingTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            {['Booking ID', 'Pet Details', 'Customer', 'Boarding Center', 'Duration', 'Amount', 'Status', ''].map(
              (h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                    i === 7 ? 'w-12' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="bg-white hover:bg-slate-50/50 transition-colors group"
            >
              {/* Booking ID */}
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  #{booking.id}
                </span>
              </td>

              {/* Pet Details */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold text-sm shrink-0">
                    {petInitial(booking.pet.pet_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {booking.pet.pet_name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      {petTypeIcon[booking.pet.pet_type] ?? <PawPrint size={13} />}
                      {booking.pet.pet_type} · {booking.pet.breed}
                    </p>
                  </div>
                </div>
              </td>

              {/* Customer */}
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-slate-800">{booking.customer.user_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{booking.customer.user_phone}</p>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{booking.customer.user_email}</p>
              </td>

              {/* Boarding Center */}
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-slate-800">{booking.center.center_name}</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {booking.center.city}, {booking.center.state}
                </p>
              </td>

              {/* Duration */}
              <td className="px-4 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-600">{formatBookingDate(booking.start_date)}</span>
                  <ArrowDown size={11} className="text-slate-300 my-0.5" />
                  <span className="text-xs text-slate-600">{formatBookingDate(booking.end_date)}</span>
                  <span className="text-[11px] font-medium text-sky-600 mt-1">
                    {booking.total_days} {booking.total_days === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </td>

              {/* Amount */}
              <td className="px-4 py-4">
                <p className="text-xs text-slate-500">{formatBookingCurrency(booking.price_per_day)}/day</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {formatBookingCurrency(booking.total_price)}
                </p>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <BookingStatusBadge status={booking.status} />
              </td>

              {/* Actions */}
              <td className="px-2 py-4">
                <BookingActionMenu onView={onView ? () => onView(booking.id) : undefined} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
