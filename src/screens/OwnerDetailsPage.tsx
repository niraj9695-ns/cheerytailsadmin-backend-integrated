import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  User,
  AlertCircle,
  PhoneCall,
  Contact,
  Home,
  CreditCard,
  Upload,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { assetUrl } from '../lib/api';
import { approveOwner, deleteOwner, fetchOwnerById, type Owner } from '../services/owners';

interface OwnerDetailsPageProps {
  ownerId: string;
  onBack: () => void;
  onNavigateDashboard: () => void;
  onNavigateOwners: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100/80 last:border-0">
      <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-sm font-medium break-words ${value ? 'text-slate-800' : 'text-slate-400 italic'}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <span className="text-sky-500">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

function StatMini({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 border ${ok ? 'bg-emerald-50/60 border-emerald-100' : 'bg-amber-50/60 border-amber-100'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 leading-none mb-0.5">{label}</p>
        <p className={`text-xs font-semibold ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Left card skeleton */}
      <div className="lg:hidden bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-slate-200" />
          <div className="h-5 w-36 bg-slate-200 rounded-full" />
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
        </div>
      </div>
      {/* Right sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded-full" />
          <div className="h-3 w-full bg-slate-100 rounded-full" />
          <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
          <div className="h-3 w-3/5 bg-slate-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function DesktopLeftSkeleton() {
  return (
    <div className="hidden lg:block bg-white rounded-xl border border-slate-100 p-6 space-y-5 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-slate-200" />
        <div className="h-5 w-36 bg-slate-200 rounded-full" />
        <div className="h-4 w-24 bg-slate-200 rounded-full" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OwnerDetailsPage({
  ownerId,
  onBack,
  onNavigateDashboard,
  onNavigateOwners,
}: OwnerDetailsPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState<Owner | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchOwnerById(ownerId)
      .then((data) => {
        if (!cancelled) setOwner(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load owner details');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  function displayName(o: Owner) {
    return o.full_name?.trim() || o.email;
  }

  function getInitials(o: Owner) {
    const name = displayName(o);
    const parts = name.split(/[\s@]+/).filter(Boolean);
    return parts
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function fmtMobile(n: string) {
    return n.length === 10 ? `+91 ${n.slice(0, 5)} ${n.slice(5)}` : n;
  }

  const isVerified = owner?.email_verified === '1';
  const hasTerms = owner?.terms_accepted === '1';
  const aadharUrl = assetUrl(owner?.aadhar_file);
  const isAadharPdf = aadharUrl?.toLowerCase().endsWith('.pdf');

  if (!loading && error) {
    return (
      <div className="screen-enter space-y-5">
        <Button variant="ghost" onClick={onBack} className="!px-4 !py-2.5 !text-sm">
          <ArrowLeft size={15} />
          Back to List
        </Button>
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter space-y-5">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2" aria-label="Breadcrumb">
            <button onClick={onNavigateDashboard} className="hover:text-sky-500 transition-colors">Dashboard</button>
            <ChevronRight size={12} className="text-slate-300" />
            <button onClick={onNavigateOwners} className="hover:text-sky-500 transition-colors">Manage Owners</button>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-600 font-medium">
              {loading ? 'Loading…' : owner ? displayName(owner) : 'Owner Details'}
            </span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Owner Details</h1>
          <p className="text-sm text-slate-500 mt-0.5">Full profile and account information.</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button variant="ghost" onClick={onBack} className="!px-4 !py-2.5 !text-sm">
            <ArrowLeft size={15} />
            Back to List
          </Button>
          <button
            onClick={() => setDeleteOpen(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Trash2 size={15} />
            Delete Owner
          </button>
          <button
            onClick={() => !isVerified && setApproveOpen(true)}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              isVerified
                ? 'border border-emerald-200 text-emerald-700 bg-emerald-50 cursor-default opacity-80'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={15} />
            {isVerified ? 'Approved' : 'Approve Owner'}
          </button>
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

        {/* ── Left: Profile card ── */}
        {loading ? (
          <DesktopLeftSkeleton />
        ) : (
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Avatar card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-400/30">
                  {getInitials(owner!)}
                </div>
                <span
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                    isVerified ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  title={isVerified ? 'Email verified' : 'Email pending'}
                />
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{displayName(owner!)}</h2>
              <p className="text-xs text-slate-500 mb-3 font-mono">{owner!.email}</p>

              {/* Role badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200 mb-1.5">
                <Shield size={11} />
                {owner!.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>

              <StatusBadge status={isVerified ? 'verified' : 'pending'} />
            </div>

            {/* Stat mini-cards */}
            <div className="space-y-2.5">
              <StatMini
                icon={<Mail size={16} />}
                label="Email Verified"
                value={isVerified ? 'Verified' : 'Not Verified'}
                ok={isVerified}
              />
              <StatMini
                icon={<FileText size={16} />}
                label="Terms Accepted"
                value={hasTerms ? 'Accepted' : 'Not Accepted'}
                ok={hasTerms}
              />
              <StatMini
                icon={<User size={16} />}
                label="Account Status"
                value={isVerified ? 'Active' : 'Pending'}
                ok={isVerified}
              />
            </div>

            {/* Member since */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <Calendar size={13} />
              Member since {formatDate(owner!.created_at)}
            </div>
          </aside>
        )}

        {/* ── Right: Details ── */}
        <div className="space-y-4">

          {loading ? (
            <ProfileSkeleton />
          ) : (
            <>
              {/* Mobile: inline profile header */}
              <div className="lg:hidden bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {getInitials(owner!)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 truncate">{displayName(owner!)}</h2>
                  <p className="text-xs text-slate-500 truncate">{owner!.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <StatusBadge status={isVerified ? 'verified' : 'pending'} />
                    <StatMini icon={<FileText size={13} />} label="Terms" value={hasTerms ? 'Accepted' : 'Pending'} ok={hasTerms} />
                  </div>
                </div>
              </div>

              {/* ① Personal Information */}
              <SectionCard icon={<User size={16} />} title="Personal Information">
                <DetailRow icon={<User size={15} />} label="Full Name" value={displayName(owner!)} />
                <DetailRow icon={<Shield size={15} />} label="Role" value={owner!.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} />
                <DetailRow icon={<Calendar size={15} />} label="Account Created" value={formatDate(owner!.created_at)} />
              </SectionCard>

              {/* ② Contact Information */}
              <SectionCard icon={<Phone size={16} />} title="Contact Information">
                <DetailRow icon={<Mail size={15} />} label="Email Address" value={owner!.email} />
                <DetailRow icon={<Phone size={15} />} label="Mobile Number" value={owner!.mobile_number ? fmtMobile(owner!.mobile_number) : ''} />
                <DetailRow icon={<PhoneCall size={15} />} label="Alternate Contact" value={owner!.alternate_contact_number ? fmtMobile(owner!.alternate_contact_number) : ''} />
                <DetailRow icon={<Contact size={15} />} label="Emergency Contact Name" value={owner!.emergency_contact_name} />
                <DetailRow icon={<PhoneCall size={15} />} label="Emergency Contact Number" value={owner!.emergency_contact_number ? fmtMobile(owner!.emergency_contact_number) : ''} />
              </SectionCard>

              {/* ③ Address Information */}
              <SectionCard icon={<MapPin size={16} />} title="Address Information">
                <DetailRow icon={<Home size={15} />} label="Residential Address" value={owner!.residential_address} />
                <DetailRow icon={<MapPin size={15} />} label="Current Address" value={owner!.current_address ?? ''} />
              </SectionCard>

              {/* ④ Account Information */}
              <SectionCard icon={<Shield size={16} />} title="Account Information">
                <DetailRow icon={<Mail size={15} />} label="Email Verification" value={isVerified ? 'Verified' : 'Not Verified'} />
                <DetailRow icon={<FileText size={15} />} label="Terms Accepted" value={hasTerms ? 'Yes — Terms & Conditions accepted' : 'Not yet accepted'} />
                <DetailRow
                  icon={isVerified ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  label="Account Status"
                  value={isVerified ? 'Active' : 'Pending Verification'}
                />
                <DetailRow icon={<Calendar size={15} />} label="Registration Date" value={formatDate(owner!.created_at)} />
              </SectionCard>

              {/* ⑤ Uploaded Documents */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500"><CreditCard size={16} /></span>
                  <h3 className="text-sm font-semibold text-slate-700">Uploaded Documents</h3>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-3">Aadhar Card</p>

                  {aadharUrl ? (
                    <div className="space-y-3">
                      {isAadharPdf ? (
                        <a
                          href={aadharUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-sky-200 text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors"
                        >
                          <FileText size={16} />
                          View Aadhar Document (PDF)
                        </a>
                      ) : (
                        <a href={aadharUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={aadharUrl}
                            alt="Aadhar card"
                            className="max-h-64 rounded-xl border border-slate-200 object-contain"
                          />
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                          <CreditCard size={12} />
                          Aadhar Card
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-medium border border-emerald-200">
                          <CheckCircle2 size={11} />
                          Uploaded
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-sky-200 hover:bg-sky-50/30 transition-colors group cursor-default">
                      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center mb-3 transition-colors">
                        <Upload size={20} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">No document uploaded</p>
                      <p className="text-xs text-slate-400 max-w-[200px]">
                        The owner has not uploaded an Aadhar card yet.
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                          <CreditCard size={12} />
                          Aadhar Card
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-medium border border-amber-200">
                          <AlertCircle size={11} />
                          Pending
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <ConfirmModal
        isOpen={approveOpen}
        variant="approve"
        ownerName={owner ? displayName(owner) : ''}
        onConfirm={() => approveOwner(ownerId)}
        onClose={() => setApproveOpen(false)}
        onSuccess={() => {
          if (owner) setOwner({ ...owner, email_verified: '1' });
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        variant="delete"
        ownerName={owner ? displayName(owner) : ''}
        onConfirm={() => deleteOwner(ownerId)}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onBack}
      />
    </div>
  );
}
