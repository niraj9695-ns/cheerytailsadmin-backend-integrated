interface StatusBadgeProps {
  status: 'verified' | 'pending' | 'rejected' | 'active' | 'inactive' | 'suspended';
  label?: string;
}

const config = {
  verified: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    defaultLabel: 'Verified',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    defaultLabel: 'Pending',
  },
  rejected: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    defaultLabel: 'Rejected',
  },
  active: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    defaultLabel: 'Active',
  },
  inactive: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    defaultLabel: 'Inactive',
  },
  suspended: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    defaultLabel: 'Suspended',
  },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const { bg, text, dot, defaultLabel } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label ?? defaultLabel}
    </span>
  );
}
