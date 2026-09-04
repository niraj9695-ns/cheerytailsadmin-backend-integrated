import type { BookingStatus } from './BookingStatusBadge';

export interface Booking {
  id: string;
  owner_id: string;
  owner_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  price_per_day: number;
  total_price: number;
  status: BookingStatus;
  center: {
    center_name: string;
    city: string;
    state: string;
  };
  customer: {
    user_name: string;
    user_phone: string;
    user_email: string;
  };
  pet: {
    pet_name: string;
    pet_type: string;
    breed: string;
  };
}

export function formatBookingDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatBookingCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

