import { useState } from 'react';
import { Search, Plus, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import Pagination from '../components/Pagination';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

interface Owner {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  role: string;
  email_verified: '0' | '1';
  created_at: string;
}

// Mock data based on provided structure
const mockOwners: Owner[] = [
  { id: '7', full_name: 'Jayshree Yeole', email: 'jayshree.a25@gmail.com', mobile_number: '9876553266', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-27' },
  { id: '8', full_name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', mobile_number: '9765432109', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-26' },
  { id: '9', full_name: 'Priya Patel', email: 'priya.p@outlook.com', mobile_number: '9823456789', role: 'center_admin', email_verified: '0', created_at: '2026-05-25' },
  { id: '10', full_name: 'Amit Kumar', email: 'amit.kumar@yahoo.com', mobile_number: '9812345678', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-24' },
  { id: '11', full_name: 'Sneha Desai', email: 'sneha.d@gmail.com', mobile_number: '9834567890', role: 'center_admin', email_verified: '1', created_at: '2026-05-23' },
  { id: '12', full_name: 'Vikram Singh', email: 'vikram.s@rediffmail.com', mobile_number: '9845678901', role: 'boarding_owner', email_verified: '0', created_at: '2026-05-22' },
  { id: '13', full_name: 'Neha Gupta', email: 'neha.gupta@gmail.com', mobile_number: '9856789012', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-21' },
  { id: '14', full_name: 'Rajesh Verma', email: 'rajesh.v@gmail.com', mobile_number: '9867890123', role: 'center_admin', email_verified: '1', created_at: '2026-05-20' },
  { id: '15', full_name: 'Kavita Joshi', email: 'kavita.j@outlook.com', mobile_number: '9878901234', role: 'boarding_owner', email_verified: '0', created_at: '2026-05-19' },
  { id: '16', full_name: 'Suresh Reddy', email: 'suresh.r@gmail.com', mobile_number: '9889012345', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-18' },
  { id: '17', full_name: 'Anita Mehta', email: 'anita.m@yahoo.com', mobile_number: '9890123456', role: 'center_admin', email_verified: '1', created_at: '2026-05-17' },
  { id: '17', full_name: 'Deepak Nair', email: 'deepak.n@gmail.com', mobile_number: '9801234567', role: 'boarding_owner', email_verified: '1', created_at: '2026-05-16' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMobile(num: string) {
  return num.length === 10 ? `+91 ${num.slice(0,5)} ${num.slice(5)}` : num;
}

interface ManageOwnersPageProps {
  onCreateOwner: () => void;
  onViewOwner: (id: string) => void;
}

export default function ManageOwnersPage({ onCreateOwner, onViewOwner }: ManageOwnersPageProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulated loading
  // setLoading(true) and setTimeout(() => setLoading(false), 1000) can be used for demo

  const filtered = mockOwners.filter(
    (o) =>
      o.full_name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.mobile_number.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleView(id: string) {
    onViewOwner(id);
  }

  function handleApprove(id: string) {
    console.log('Approve owner:', id);
    // TODO: Show confirmation and call API
  }

  function handleDelete(id: string) {
    console.log('Delete owner:', id);
    // TODO: Show confirmation dialog
  }

  return (
    <div className="screen-enter space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Owners</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and monitor all registered owners.</p>
        </div>
        <Button className="shrink-0" onClick={onCreateOwner}>
          <Plus size={17} />
          Create Owner
        </Button>
      </div>

      {/* Card wrapper */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, mobile…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
            />
          </div>
          <p className="text-xs text-slate-400 sm:text-right">
            {filtered.length} {filtered.length === 1 ? 'owner' : 'owners'} found
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4"><TableSkeleton rows={5} columns={7} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No matching owners' : 'No owners yet'}
            message={search ? 'Try adjusting your search terms.' : 'Get started by creating your first owner.'}
            action={
              !search && (
                <Button variant="primary" onClick={onCreateOwner}>
                  <UserPlus size={16} />
                  Create Owner
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0">
                  <tr>
                    {['ID', 'Full Name', 'Email', 'Mobile', 'Role', 'Email Status', 'Created', ''].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                          h ? 'text-left' : 'w-12'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {paginated.map((owner) => (
                    <tr
                      key={owner.id + owner.email}
                      className="bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700">#{owner.id}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-800 font-medium">{owner.full_name}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 truncate max-w-[200px]">{owner.email}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">{formatMobile(owner.mobile_number)}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 capitalize">{owner.role.replace('_', ' ')}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={owner.email_verified === '1' ? 'verified' : 'pending'} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(owner.created_at)}</td>
                      <td className="px-2 py-3.5">
                        <ActionMenu
                          onView={() => handleView(owner.id)}
                          onApprove={() => handleApprove(owner.id)}
                          onDelete={() => handleDelete(owner.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((owner) => (
                <div key={owner.id + owner.email} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{owner.full_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">ID #{owner.id} • {formatDate(owner.created_at)}</p>
                    </div>
                    <ActionMenu
                      onView={() => handleView(owner.id)}
                      onApprove={() => handleApprove(owner.id)}
                      onDelete={() => handleDelete(owner.id)}
                    />
                  </div>
                  <p className="text-sm text-sky-600 truncate">{owner.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <StatusBadge status={owner.email_verified === '1' ? 'verified' : 'pending'} />
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 capitalize">{owner.role.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">{formatMobile(owner.mobile_number)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
