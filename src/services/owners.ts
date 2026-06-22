import { adminApiRequest } from '../lib/api';

export interface Owner {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  alternate_contact_number: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  residential_address: string;
  current_address: string | null;
  role: string;
  email_verified: '0' | '1';
  terms_accepted: '0' | '1';
  aadhar_file: string | null;
  created_at: string;
  updated_at: string;
}

export type OwnerRole = 'pet_owner' | 'boarding_owner';

export async function fetchOwnersByRole(role: OwnerRole): Promise<Owner[]> {
  const res = await adminApiRequest<Owner[]>(`/api/admin/owners?role=${role}`);
  return res.data;
}

export async function fetchOwners(): Promise<Owner[]> {
  return fetchOwnersByRole('pet_owner');
}

export async function fetchBoardingOwners(): Promise<Owner[]> {
  return fetchOwnersByRole('boarding_owner');
}

export async function fetchOwnerById(id: string): Promise<Owner> {
  const res = await adminApiRequest<Owner>(`/api/admin/owners/${id}`);
  return res.data;
}

export async function approveOwner(id: string): Promise<void> {
  await adminApiRequest(`/api/admin/owners/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ status: 'approved' }),
  });
}

export async function deleteOwner(id: string): Promise<void> {
  await adminApiRequest(`/api/admin/owners/${id}`, {
    method: 'DELETE',
  });
}
