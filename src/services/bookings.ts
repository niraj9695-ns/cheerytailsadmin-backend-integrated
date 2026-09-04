import { apiRequest } from '../lib/api';
import type { Booking } from '../components/bookingTypes';

export interface RawBooking {
  id: string;
  user_id: string;
  pet_id: string;
  center_id: string;
  start_date: string;
  end_date: string;
  total_days: string;
  price_per_day: string;
  total_price: string;
  status: Booking['status'];
  special_instructions: string;
  created_at: string;
  updated_at: string;
  center_name: string;
  city: string;
  state: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  pet_name: string;
  pet_type: string;
  breed: string;
  owner_id?: string;
  owner_name?: string;
}

type BookingResponseData =
  | RawBooking[]
  | {
      bookings?: RawBooking[];
      data?: RawBooking[];
      results?: RawBooking[];
    };

function normalizeBookingStatus(status: string): Booking['status'] {
  const normalized = status.toLowerCase();
  if (normalized === 'accepted' || normalized === 'confirmed') return 'accepted';
  if (normalized === 'pending' || normalized === 'requested') return 'pending';
  if (normalized === 'rejected' || normalized === 'declined') return 'rejected';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'cancelled';
  if (normalized === 'completed') return 'completed';
  return 'pending';
}

function mapBooking(raw: RawBooking, ownerId?: string): Booking {
  return {
    id: raw.id,
    owner_id: raw.owner_id ?? ownerId ?? '',
    owner_name: raw.owner_name ?? `Owner ${ownerId ?? ''}`,
    start_date: raw.start_date,
    end_date: raw.end_date,
    total_days: Number(raw.total_days) || 0,
    price_per_day: Number(raw.price_per_day) || 0,
    total_price: Number(raw.total_price) || 0,
    status: normalizeBookingStatus(String(raw.status ?? 'pending')),
    center: {
      center_name: raw.center_name,
      city: raw.city,
      state: raw.state,
    },
    customer: {
      user_name: raw.user_name,
      user_phone: raw.user_phone,
      user_email: raw.user_email,
    },
    pet: {
      pet_name: raw.pet_name,
      pet_type: raw.pet_type,
      breed: raw.breed,
    },
  };
}

export async function fetchBookingsByOwner(ownerId: string): Promise<Booking[]> {
  const res = await apiRequest<BookingResponseData>(`/api/bookings/owner/${ownerId}`, {}, true);
  const bookings = Array.isArray(res.data)
    ? res.data
    : res.data.bookings ?? res.data.data ?? res.data.results;

  if (!bookings) {
    throw new Error('The bookings response did not contain a booking list');
  }

  return bookings.map((booking) => mapBooking(booking, ownerId));
}
