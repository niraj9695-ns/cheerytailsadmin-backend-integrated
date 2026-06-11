interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 8 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-4 bg-slate-200/70 rounded animate-pulse ${
                colIdx === 0 ? 'w-12' : colIdx === columns - 1 ? 'w-8' : 'flex-1'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
