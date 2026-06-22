import { useState, useEffect } from 'react';
import { Search, Plus, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import Pagination from '../components/Pagination';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { approveOwner, deleteOwner, type Owner } from '../services/owners';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMobile(num: string) {
  if (!num) return '—';
  return num.length === 10 ? `+91 ${num.slice(0, 5)} ${num.slice(5)}` : num;
}

function displayName(owner: Owner) {
  return owner.full_name?.trim() || owner.email;
}

interface ManageOwnersPageProps {
  title: string;
  subtitle?: string;
  fetchList: () => Promise<Owner[]>;
  onCreateOwner?: () => void;
  onViewOwner: (id: string) => void;
  onViewCenters?: (id: string) => void;
}

export default function ManageOwnersPage({
  title,
  subtitle = 'Manage and monitor all registered owners.',
  fetchList,
  onCreateOwner,
  onViewOwner,
  onViewCenters,
}: ManageOwnersPageProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [approveTarget, setApproveTarget] = useState<Owner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Owner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchList()
      .then((data) => {
        if (!cancelled) setOwners(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load owners');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  const filtered = owners.filter((o) => {
    const name = displayName(o).toLowerCase();
    const q = search.toLowerCase();
    return (
      name.includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.mobile_number.includes(search)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleView(id: string) {
    onViewOwner(id);
  }

  function handleApprove(owner: Owner) {
    setApproveTarget(owner);
  }

  function handleDelete(owner: Owner) {
    setDeleteTarget(owner);
  }

  return (
    <div className="screen-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        {onCreateOwner && (
          <Button className="shrink-0" onClick={onCreateOwner}>
            <Plus size={17} />
            Create Owner
          </Button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
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

        {loading ? (
          <div className="p-4"><TableSkeleton rows={5} columns={7} /></div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setLoading(true);
                setError('');
                fetchList()
                  .then(setOwners)
                  .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load owners'))
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No matching owners' : 'No owners yet'}
            message={search ? 'Try adjusting your search terms.' : 'Get started by creating your first owner.'}
            action={
              !search &&
              onCreateOwner && (
                <Button variant="primary" onClick={onCreateOwner}>
                  <UserPlus size={16} />
                  Create Owner
                </Button>
              )
            }
          />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0">
                  <tr>
                    {['ID', 'Full Name', 'Email', 'Mobile', 'Email Status', 'Created', ''].map((h) => (
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
                      key={owner.id}
                      className="bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700">#{owner.id}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-800 font-medium">{displayName(owner)}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 truncate max-w-[200px]">{owner.email}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">{formatMobile(owner.mobile_number)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={owner.email_verified === '1' ? 'verified' : 'pending'} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(owner.created_at)}</td>
                      <td className="px-2 py-3.5">
                        <ActionMenu
                          onView={() => handleView(owner.id)}
                          onViewCenters={onViewCenters ? () => onViewCenters(owner.id) : undefined}
                          onApprove={owner.email_verified !== '1' ? () => handleApprove(owner) : undefined}
                          onDelete={() => handleDelete(owner)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((owner) => (
                <div key={owner.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{displayName(owner)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">ID #{owner.id} • {formatDate(owner.created_at)}</p>
                    </div>
                    <ActionMenu
                      onView={() => handleView(owner.id)}
                      onViewCenters={onViewCenters ? () => onViewCenters(owner.id) : undefined}
                      onApprove={owner.email_verified !== '1' ? () => handleApprove(owner) : undefined}
                      onDelete={() => handleDelete(owner)}
                    />
                  </div>
                  <p className="text-sm text-sky-600 truncate">{owner.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <StatusBadge status={owner.email_verified === '1' ? 'verified' : 'pending'} />
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">{formatMobile(owner.mobile_number)}</span>
                  </div>
                </div>
              ))}
            </div>

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

      <ConfirmModal
        isOpen={!!approveTarget}
        variant="approve"
        ownerName={approveTarget ? displayName(approveTarget) : ''}
        onConfirm={async () => {
          const id = approveTarget!.id;
          await approveOwner(id);
          setOwners((prev) =>
            prev.map((o) => (o.id === id ? { ...o, email_verified: '1' } : o)),
          );
        }}
        onClose={() => setApproveTarget(null)}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        variant="delete"
        ownerName={deleteTarget ? displayName(deleteTarget) : ''}
        onConfirm={async () => {
          const id = deleteTarget!.id;
          await deleteOwner(id);
          setOwners((prev) => prev.filter((o) => o.id !== id));
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
