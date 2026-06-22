import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Ban,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Clock,
  Ruler,
  DollarSign,
  CreditCard,
  FileText,
  Wind,
  Trees,
  Video,
  Heart,
  Image,
  Maximize2,
  Dog,
  Cat,
  Bird,
  Fish,
  Home,
  Shield,
  Syringe,
  Scissors,
  GraduationCap,
  Moon,
  Sun,
  PawPrint,
  Weight,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  Eye,
  Download,
  Landmark,
  Stethoscope,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { fetchCenterById, type CenterDetail } from '../services/centers';

interface CenterDetailsPageProps {
  centerId: string;
  listLabel?: string;
  onBack: () => void;
  onNavigateDashboard: () => void;
  onNavigateCenters: () => void;
}

// ─── Icon + label configs ─────────────────────────────────────────────────────

const typeIcon: Record<string, React.ReactNode> = {
  dog: <Dog size={18} />,
  cat: <Cat size={18} />,
  bird: <Bird size={18} />,
  fish: <Fish size={18} />,
  both: <PawPrint size={18} />,
  pet: <Building2 size={18} />,
};

const typeLabel: Record<string, string> = {
  dog: 'Dog Boarding',
  cat: 'Cat Boarding',
  bird: 'Bird Boarding',
  fish: 'Fish Boarding',
  both: 'Dog & Cat Boarding',
  pet: 'All Pets',
};

const typeColor: Record<string, string> = {
  dog: 'bg-sky-100 text-sky-700 border-sky-200',
  cat: 'bg-violet-100 text-violet-700 border-violet-200',
  bird: 'bg-amber-100 text-amber-700 border-amber-200',
  fish: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  both: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pet: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function centerTypeMeta(type: string) {
  const key = type.toLowerCase();
  return {
    icon: typeIcon[key] ?? <Building2 size={18} />,
    label: typeLabel[key] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    color: typeColor[key] ?? 'bg-slate-100 text-slate-700 border-slate-200',
  };
}

const amenityIcons: Record<string, React.ReactNode> = {
  AC: <Wind size={14} />,
  'Play Area': <Trees size={14} />,
  CCTV: <Video size={14} />,
  '24/7 Vet': <Heart size={14} />,
};

// ─── Sub-components ────────────────────────────────────────────────────────────

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

function StatMini({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-3 border border-slate-100 bg-slate-50/50">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</p>
        <p className="text-base font-bold text-slate-800">
          {value}
          {unit && <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

function TimeChip({ time }: { time: string }) {
  if (!time) return null;
  const h = parseInt(time.split(':')[0]!);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  const formatted = `${hour}:${time.split(':')[1]} ${ampm}`;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
      <Clock size={13} className="text-slate-400" />
      {formatted}
    </span>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="lg:hidden bg-white rounded-xl border border-slate-100 p-5 space-y-4">
        <div className="h-32 rounded-xl bg-slate-200" />
        <div className="h-5 w-40 bg-slate-200 rounded-full mx-auto" />
        <div className="flex justify-center gap-2">
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>
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
    <div className="hidden lg:block bg-white rounded-xl border border-slate-100 p-5 space-y-4 animate-pulse">
      <div className="h-36 rounded-xl bg-slate-200" />
      <div className="h-5 w-36 bg-slate-200 rounded-full mx-auto" />
      <div className="flex justify-center gap-2">
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CenterDetailsPage({
  centerId,
  listLabel = 'Manage Centers',
  onBack,
  onNavigateDashboard,
  onNavigateCenters,
}: CenterDetailsPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [center, setCenter] = useState<CenterDetail | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchCenterById(centerId)
      .then((data) => {
        if (!cancelled) setCenter(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load center details');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [centerId]);

  function mockApprove(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1400));
  }

  function mockSuspend(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }

  function formatDate(d: string) {
    if (!d || d === '0000-00-00') return '—';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatCurrency(v: string) {
    if (!v) return '—';
    const num = parseFloat(v);
    if (Number.isNaN(num)) return '—';
    return `₹${num.toLocaleString()}`;
  }

  const isActive = center?.is_active === '1';
  const typeMeta = center ? centerTypeMeta(center.center_type) : null;
  const coverImage = center?.image_urls[0] ?? null;

  if (!loading && error) {
    return (
      <div className="screen-enter space-y-5">
        <Button variant="ghost" onClick={onBack} className="!px-4 !py-2.5 !text-sm">
          <ArrowLeft size={15} />
          Back
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
            <button onClick={onNavigateDashboard} className="hover:text-sky-500 transition-colors">
              Dashboard
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <button onClick={onNavigateCenters} className="hover:text-sky-500 transition-colors">
              {listLabel}
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-600 font-medium">
              {loading ? 'Loading…' : center?.center_name ?? 'Center Details'}
            </span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Center Details</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete profile and booking information.</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button variant="ghost" onClick={onBack} className="!px-4 !py-2.5 !text-sm">
            <ArrowLeft size={15} />
            Back
          </Button>
          {isActive ? (
            <button
              onClick={() => setSuspendOpen(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Ban size={15} />
              Suspend Center
            </button>
          ) : (
            <button
              onClick={() => setApproveOpen(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <CheckCircle2 size={15} />
              Approve Center
            </button>
          )}
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
        {/* ── Left: Profile card ── */}
        {loading ? (
          <DesktopLeftSkeleton />
        ) : (
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Avatar card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 flex flex-col text-center">
              {/* Image placeholder */}
              <div className="relative mb-4 mx-auto w-full">
                <div className="aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt={center!.center_name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={36} className="text-slate-400" />
                  )}
                </div>
                {/* Status corner badge */}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={isActive ? 'active' : 'suspended'} />
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{center!.center_name}</h2>
              <p className="text-xs text-slate-500 mb-3 font-mono">{center!.email}</p>

              {/* Type badge */}
              <span
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${typeMeta!.color}`}
              >
                {typeMeta!.icon}
                {typeMeta!.label}
              </span>
            </div>

            {/* Stat mini-cards */}
            <div className="grid grid-cols-1 gap-2.5">
              <StatMini
                icon={<Ruler size={18} />}
                label="Total Capacity"
                value={center!.total_capacity}
                unit="spots"
              />
              <StatMini icon={<DollarSign size={18} />} label="Price Per Day" value={formatCurrency(center!.price_per_day)} />
              <StatMini
                icon={<Ruler size={18} />}
                label="Service Radius"
                value={center!.service_radius || '—'}
                unit={center!.service_radius ? 'miles' : undefined}
              />
            </div>

            {/* Member since */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <Calendar size={13} />
              Registered {formatDate(center!.created_at)}
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
              <div className="lg:hidden bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
                <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt={center!.center_name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={32} className="text-slate-400" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-base font-bold text-slate-900">{center!.center_name}</h2>
                  <p className="text-xs text-slate-500">{center!.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <StatusBadge status={isActive ? 'active' : 'suspended'} />
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${typeMeta!.color}`}
                    >
                      {typeMeta!.icon}
                      {typeMeta!.label}
                    </span>
                  </div>
                </div>
                {/* Mobile stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-base font-bold text-slate-800">{center!.total_capacity}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Capacity</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-base font-bold text-slate-800">{formatCurrency(center!.price_per_day)}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Per Day</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-base font-bold text-slate-800">{center!.service_radius ? `${center!.service_radius} mi` : '—'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Radius</p>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Basic Information */}
              <SectionCard icon={<Building2 size={16} />} title="Basic Information">
                <DetailRow icon={<Building2 size={15} />} label="Center Name" value={center!.center_name} />
                <DetailRow
                  icon={typeMeta!.icon}
                  label="Center Type"
                  value={typeMeta!.label}
                />
                <DetailRow
                  icon={<FileText size={15} />}
                  label="Description"
                  value={center!.description || 'No description provided.'}
                />
                <DetailRow icon={<Calendar size={15} />} label="Created Date" value={formatDate(center!.created_at)} />
              </SectionCard>

              {/* SECTION 2: Location Information */}
              <SectionCard icon={<MapPin size={16} />} title="Location Information">
                <DetailRow icon={<MapPin size={15} />} label="Address" value={center!.address_line1} />
                {center!.address_line2 && (
                  <DetailRow icon={<MapPin size={15} />} label="Address Line 2" value={center!.address_line2} />
                )}
                <DetailRow
                  icon={<MapPin size={15} />}
                  label="City, State"
                  value={`${center!.city}, ${center!.state} ${center!.zip_code}`}
                />
                {(center!.latitude || center!.longitude) && (
                  <DetailRow
                    icon={<MapPin size={15} />}
                    label="Coordinates"
                    value={`${center!.latitude}, ${center!.longitude}`}
                  />
                )}
              </SectionCard>

              {/* Map placeholder */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500">
                    <MapPin size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">Location Preview</h3>
                </div>
                <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-400">Map preview unavailable</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Contact Information */}
              <SectionCard icon={<Phone size={16} />} title="Contact Information">
                <DetailRow icon={<Phone size={15} />} label="Primary Contact" value={center!.primary_contact} />
                <DetailRow icon={<Mail size={15} />} label="Email Address" value={center!.email} />
                <DetailRow
                  icon={<Globe size={15} />}
                  label="Website"
                  value={center!.website || 'No website provided'}
                />
              </SectionCard>

              {/* SECTION 4: Capacity Information */}
              <SectionCard icon={<Ruler size={16} />} title="Capacity Information">
                <DetailRow icon={<Ruler size={15} />} label="Daily Capacity" value={`${center!.daily_capacity} pets`} />
                <DetailRow icon={<Ruler size={15} />} label="Total Capacity" value={`${center!.total_capacity} spots`} />
                <DetailRow
                  icon={<DollarSign size={15} />}
                  label="Price Per Day"
                  value={formatCurrency(center!.price_per_day)}
                />
              </SectionCard>

              {/* SECTION 5: Business & Registration */}
              <SectionCard icon={<CreditCard size={16} />} title="Business & Registration">
                <DetailRow
                  icon={<FileText size={15} />}
                  label="Registration License"
                  value={center!.registration_license}
                />
                <div className="pt-2">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">License Proof</p>
                  {center!.license_proof_url ? (
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileText size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">License Document</p>
                        <p className="text-xs text-slate-500">Document uploaded</p>
                      </div>
                      <a
                        href={center!.license_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View Document
                      </a>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <FileText size={18} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">No license proof uploaded</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Document required for verification</p>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* SECTION 6: Amenities */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500">
                    <Heart size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">Amenities</h3>
                </div>
                <div className="px-5 py-4">
                  {center!.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {center!.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                        >
                          {amenityIcons[amenity]}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No amenities specified.</p>
                  )}
                </div>
              </div>

              {/* SECTION 7: Operating Hours */}
              {(center!.opening_time || center!.closing_time) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500">
                    <Clock size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">Operating Hours</h3>
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {center!.opening_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Opening:</span>
                      <TimeChip time={center!.opening_time} />
                    </div>
                    )}
                    {center!.opening_time && center!.closing_time && (
                    <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                    )}
                    {center!.closing_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Closing:</span>
                      <TimeChip time={center!.closing_time} />
                    </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* SECTION 9: Pet Boarding Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500">
                    <PawPrint size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">Pet Boarding Information</h3>
                </div>
                <div className="px-5 py-4 space-y-5">
                  {/* Row 1: Property Type, Fencing, Supervision */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                          <Home size={16} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Property Type</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 capitalize">
                        {center!.property_type}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fencing Status</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {center!.fencing_status || 'Not specified'}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Clock size={16} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Supervision</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {center!.supervision_level}
                      </p>
                    </div>
                  </div>

                  {/* Accepted Pet Types */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Accepted Pet Types
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {center!.accepted_pet_types.length > 0 ? (
                        center!.accepted_pet_types.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200"
                          >
                            {type.toLowerCase() === 'dog' && <Dog size={14} />}
                            {type.toLowerCase() === 'cat' && <Cat size={14} />}
                            {type.toLowerCase() === 'bird' && <Bird size={14} />}
                            {type.toLowerCase() === 'fish' && <Fish size={14} />}
                            {!['dog', 'cat', 'bird', 'fish'].includes(type.toLowerCase()) && <PawPrint size={14} />}
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No pet types specified</span>
                      )}
                    </div>
                  </div>

                  {/* Size & Weight Restrictions */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Size & Weight Restrictions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {center!.size_restrictions.length > 0 ? (
                        center!.size_restrictions.map((size) => (
                          <span
                            key={size}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200"
                          >
                            <Weight size={12} />
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No size restrictions</span>
                      )}
                    </div>
                  </div>

                  {/* Age Preferences */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Age Preferences
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {center!.age_preferences.length > 0 ? (
                        center!.age_preferences.map((age) => (
                          <span
                            key={age}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200"
                          >
                            <Calendar size={12} />
                            {age}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No age preferences specified</span>
                      )}
                    </div>
                  </div>

                  {/* Vaccination Policy */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Syringe size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
                          Vaccination Policy
                        </p>
                        <p className="text-sm font-bold text-slate-800 mb-2">
                          {center!.vaccination_policy || 'Not specified'}
                        </p>
                        {center!.required_vaccines.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {center!.required_vaccines.map((vaccine) => (
                              <span
                                key={vaccine}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
                              >
                                {vaccine}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Boarding Services */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Boarding Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {center!.boarding_services.length > 0 ? (
                        center!.boarding_services.map((service) => (
                          <span
                            key={service}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                              service === 'Overnight Boarding'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : service === 'Day Care'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : service === 'Grooming'
                                ? 'bg-pink-50 text-pink-700 border-pink-200'
                                : service === 'Training'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {service === 'Overnight Boarding' && <Moon size={14} />}
                            {service === 'Day Care' && <Sun size={14} />}
                            {service === 'Grooming' && <Scissors size={14} />}
                            {service === 'Training' && <GraduationCap size={14} />}
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No services listed</span>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Special Instructions
                    </p>
                    {center!.special_instructions ? (
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex gap-3">
                          <ClipboardList size={18} className="text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {center!.special_instructions}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No special instructions provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 9: Documents */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sky-500">
                    <FileCheck size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* License Proof Card */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:border-slate-200 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {center!.license_proof_url ? (
                          <FileText size={28} className="text-slate-400" />
                        ) : (
                          <AlertTriangle size={28} className="text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                              <ShieldCheck size={14} className="text-emerald-500" />
                              License Proof
                            </h4>
                            {center!.license_proof_url ? (
                              <p className="text-xs text-slate-500 mt-0.5 truncate">License document uploaded</p>
                            ) : (
                              <p className="text-xs text-amber-600 mt-1">Document not uploaded</p>
                            )}
                          </div>
                          {center!.license_proof_url ? (
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={center!.license_proof_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-600 hover:bg-sky-50 border border-sky-200 hover:border-sky-300 transition-colors"
                              >
                                <Eye size={13} />
                                Preview
                              </a>
                              <a
                                href={center!.license_proof_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors"
                              >
                                <Download size={13} />
                                Download
                              </a>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information Card */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:border-slate-200 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center shrink-0">
                        <Landmark size={28} className="text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <Shield size={14} className="text-emerald-500" />
                          Insurance Information
                        </h4>
                        {center!.insurance_provider ? (
                          <div className="mt-2 space-y-1.5">
                            <p className="text-xs text-slate-600">
                              <span className="font-medium text-slate-500">Provider:</span>{' '}
                              {center!.insurance_provider}
                            </p>
                            <p className="text-xs text-slate-600">
                              <span className="font-medium text-slate-500">Policy:</span>{' '}
                              <span className="font-mono">{center!.insurance_policy_number || '—'}</span>
                            </p>
                            {center!.insurance_expiry_date && (
                              <p className="text-xs text-slate-600 flex items-center gap-1">
                                <span className="font-medium text-slate-500">Expires:</span>{' '}
                                {formatDate(center!.insurance_expiry_date)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <AlertTriangle size={12} className="text-amber-400" />
                            Insurance information not provided
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Veterinary Information Card */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:border-slate-200 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center shrink-0">
                        <Stethoscope size={28} className="text-sky-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <Heart size={14} className="text-sky-500" />
                          Veterinary Information
                        </h4>
                        {center!.vet_clinic_name ? (
                          <div className="mt-2 space-y-1.5">
                            <p className="text-xs text-slate-600">
                              <span className="font-medium text-slate-500">Clinic:</span>{' '}
                              {center!.vet_clinic_name}
                            </p>
                            {center!.vet_clinic_address && (
                              <p className="text-xs text-slate-600 flex items-start gap-1">
                                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>{center!.vet_clinic_address}</span>
                              </p>
                            )}
                            {center!.vet_clinic_contact && (
                              <p className="text-xs text-slate-600 flex items-center gap-1">
                                <Phone size={12} className="text-slate-400" />
                                <span>{center!.vet_clinic_contact}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <AlertTriangle size={12} className="text-amber-400" />
                            Veterinary information not provided
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* SECTION 8: Center Gallery */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sky-500">
                      <Image size={16} />
                    </span>
                    <h3 className="text-sm font-semibold text-slate-700">Center Gallery</h3>
                  </div>
                  <span className="text-xs text-slate-400">{center!.image_urls.length} images</span>
                </div>
                <div className="p-4">
                  {center!.image_urls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {center!.image_urls.map((url) => (
                      <button
                        key={url}
                        onClick={() => setSelectedImg(url)}
                        className="aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group relative overflow-hidden transition-all hover:shadow-md hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      >
                        <img src={url} alt="Center" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 size={20} className="text-sky-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic text-center py-6">No gallery images uploaded.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Lightbox placeholder ── */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
            onClick={() => setSelectedImg(null)}
          >
            <span className="sr-only">Close</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl w-full max-h-[85vh] rounded-xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg} alt="Center gallery" className="w-full h-full object-contain bg-slate-900" />
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <ConfirmModal
        isOpen={approveOpen}
        variant="approve"
        ownerName={center?.center_name ?? ''}
        onConfirm={mockApprove}
        onClose={() => setApproveOpen(false)}
        onSuccess={() => {
          if (center) setCenter({ ...center, is_active: '1' });
        }}
      />

      <ConfirmModal
        isOpen={suspendOpen}
        variant="delete"
        ownerName={center?.center_name ?? ''}
        onConfirm={mockSuspend}
        onClose={() => setSuspendOpen(false)}
        onSuccess={() => {
          if (center) setCenter({ ...center, is_active: '0' });
        }}
      />
    </div>
  );
}
