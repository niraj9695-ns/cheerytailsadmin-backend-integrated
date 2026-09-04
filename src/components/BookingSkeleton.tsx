interface BookingSkeletonProps {
  variant?: 'cards' | 'table' | 'summary';
  rows?: number;
}

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-8 w-16 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-200/50 rounded animate-pulse" />
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-200/70 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-16 bg-slate-200/70 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="bg-white">
              {Array.from({ length: 8 }).map((_, col) => (
                <td key={col} className="px-4 py-4">
                  <div
                    className={`h-4 bg-slate-200/60 rounded animate-pulse ${
                      col === 0
                        ? 'w-10'
                        : col === 1
                        ? 'w-28'
                        : col === 6
                        ? 'w-20'
                        : 'w-full'
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="lg:hidden space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-200/70 rounded-full animate-pulse" />
            </div>
            <div className="w-8 h-8 bg-slate-200/70 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full bg-slate-200/70 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-200/50 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-200/70 rounded animate-pulse" />
            <div className="h-3 w-40 bg-slate-200/50 rounded animate-pulse" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <div className="space-y-1">
              <div className="h-3 w-16 bg-slate-200/50 rounded animate-pulse" />
              <div className="h-5 w-16 bg-slate-200/70 rounded animate-pulse" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-3 w-20 bg-slate-200/50 rounded animate-pulse" />
              <div className="h-6 w-20 bg-slate-200/70 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookingSkeleton({ variant = 'table', rows = 6 }: BookingSkeletonProps) {
  if (variant === 'summary') return <SummarySkeleton />;
  if (variant === 'cards') return <MobileCardSkeleton rows={rows} />;
  return <TableSkeleton rows={rows} />;
}
