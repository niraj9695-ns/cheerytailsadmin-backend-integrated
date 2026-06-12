import { apiRequest, assetUrl } from '../lib/api';

export interface BoardingCenter {
  id: string;
  user_id: string;
  center_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string | null;
  longitude: string | null;
  center_type: string;
  description: string | null;
  images: string | null;
  price_per_day: string | null;
  daily_capacity: string;
  is_active: '0' | '1';
  created_at: string;
  updated_at: string;
  address_line_2: string | null;
  registration_license_number: string | null;
  license_proof: string | null;
  service_area_radius: string | null;
  total_capacity: string;
  amenities: string | null;
  opening_time: string | null;
  closing_time: string | null;
  primary_contact_number: string | null;
  email_address: string | null;
  website_url: string | null;
  property_type: string | null;
  fencing_status: string | null;
  supervision_level: string | null;
  accepted_pet_types: string | null;
  size_weight_restrictions: string | null;
  age_preferences: string | null;
  vaccination_policy: string | null;
  required_vaccines: string | null;
  boarding_services: string | null;
  special_instructions: string | null;
}

export interface CenterDetail {
  id: string;
  center_name: string;
  center_type: string;
  description: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  primary_contact: string;
  email: string;
  website: string;
  daily_capacity: string;
  total_capacity: string;
  price_per_day: string;
  service_radius: string;
  registration_license: string;
  license_proof_url: string | null;
  amenities: string[];
  opening_time: string;
  closing_time: string;
  is_active: '0' | '1';
  created_at: string;
  property_type: string;
  fencing_status: string;
  supervision_level: string;
  accepted_pet_types: string[];
  size_restrictions: string[];
  age_preferences: string[];
  vaccination_policy: string;
  required_vaccines: string[];
  boarding_services: string[];
  special_instructions: string;
  image_urls: string[];
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function formatTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function mapToCenterDetail(raw: BoardingCenter): CenterDetail {
  return {
    id: raw.id,
    center_name: raw.center_name,
    center_type: raw.center_type,
    description: raw.description ?? '',
    address_line1: raw.address,
    address_line2: raw.address_line_2 ?? '',
    city: raw.city,
    state: raw.state,
    zip_code: raw.zip_code,
    latitude: raw.latitude ?? '',
    longitude: raw.longitude ?? '',
    primary_contact: raw.primary_contact_number ?? '',
    email: raw.email_address ?? '',
    website: raw.website_url ?? '',
    daily_capacity: raw.daily_capacity,
    total_capacity: raw.total_capacity,
    price_per_day: raw.price_per_day ?? '',
    service_radius: raw.service_area_radius ?? '',
    registration_license: raw.registration_license_number ?? '',
    license_proof_url: assetUrl(raw.license_proof),
    amenities: parseJsonArray(raw.amenities),
    opening_time: formatTime(raw.opening_time),
    closing_time: formatTime(raw.closing_time),
    is_active: raw.is_active,
    created_at: raw.created_at,
    property_type: raw.property_type ?? '',
    fencing_status: raw.fencing_status ?? '',
    supervision_level: raw.supervision_level ?? '',
    accepted_pet_types: parseJsonArray(raw.accepted_pet_types).map(titleCase),
    size_restrictions: parseJsonArray(raw.size_weight_restrictions),
    age_preferences: parseJsonArray(raw.age_preferences),
    vaccination_policy: raw.vaccination_policy ?? '',
    required_vaccines: parseJsonArray(raw.required_vaccines),
    boarding_services: parseJsonArray(raw.boarding_services),
    special_instructions: raw.special_instructions ?? '',
    image_urls: parseJsonArray(raw.images)
      .map((path) => assetUrl(path))
      .filter((url): url is string => Boolean(url)),
  };
}

export async function fetchCenters(): Promise<BoardingCenter[]> {
  const res = await apiRequest<BoardingCenter[]>('/api/admin/boarding-centers/list', {}, true);
  return res.data;
}

export async function fetchCenterById(id: string): Promise<CenterDetail> {
  const res = await apiRequest<BoardingCenter>(`/api/admin/boarding-centers/${id}`, {}, true);
  return mapToCenterDetail(res.data);
}
