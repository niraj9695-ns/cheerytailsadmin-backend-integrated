import { MapPin, ArrowDown, Dog, Cat, Bird, Fish, PawPrint, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import BookingActionMenu from './BookingActionMenu';
import { type Booking, formatBookingDate, formatBookingCurrency } from './bookingTypes';

interface BookingCardProps {
  booking: Booking;
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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function BookingCard({ booking, onView }: BookingCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-200 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 font-mono">#{booking.id}</p>
          <div className="mt-1.5">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>
        <BookingActionMenu onView={onView ? () => onView(booking.id) : undefined} />
      </div>

      {/* Pet Information */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold shrink-0">
          {petInitial(booking.pet.pet_name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{booking.pet.pet_name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {petTypeIcon[booking.pet.pet_type] ?? <PawPrint size={13} />}
            {booking.pet.pet_type} · {booking.pet.breed}
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-1.5">
        <InfoRow label="Customer">{booking.customer.user_name}</InfoRow>
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Phone size={12} className="text-slate-400" />
            {booking.customer.user_phone}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <Mail size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{booking.customer.user_email}</span>
          </span>
        </div>
      </div>

      {/* Boarding Center */}
      <div className="pt-3 border-t border-slate-100">
        <InfoRow label="Boarding Center">
          <p className="font-medium text-slate-800">{booking.center.center_name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-slate-400" />
            {booking.center.city}, {booking.center.state}
          </p>
        </InfoRow>
      </div>

      {/* Booking Dates */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Calendar size={11} />
          Booking Dates
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-slate-400">Start</p>
            <p className="text-sm font-medium text-slate-700">{formatBookingDate(booking.start_date)}</p>
          </div>
          <ArrowDown size={14} className="text-slate-300 rotate-[-90deg]" />
          <div className="flex-1 text-right">
            <p className="text-[11px] text-slate-400">End</p>
            <p className="text-sm font-medium text-slate-700">{formatBookingDate(booking.end_date)}</p>
          </div>
        </div>
        <p className="text-xs font-medium text-sky-600 mt-2">
          {booking.total_days} {booking.total_days === 1 ? 'day' : 'days'} total
        </p>
      </div>

      {/* Pricing */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <DollarSign size={11} />
            Price per day
          </p>
          <p className="text-sm font-medium text-slate-700">{formatBookingCurrency(booking.price_per_day)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">Total Amount</p>
          <p className="text-lg font-bold text-slate-900">{formatBookingCurrency(booking.total_price)}</p>
        </div>
      </div>
    </div>
  );
}
