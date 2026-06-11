import { Users, Building2, TrendingUp, Activity } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 flex items-center justify-center text-sky-500">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="screen-enter space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin!</h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your platform today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={18} />}
          label="Total Owners"
          value="248"
          trend="+12%"
          trendUp
        />
        <StatCard
          icon={<Building2 size={18} />}
          label="Active Centers"
          value="56"
          trend="+4"
          trendUp
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Monthly Revenue"
          value="$82.4K"
          trend="+8.2%"
          trendUp
        />
        <StatCard
          icon={<Activity size={18} />}
          label="Active Users"
          value="1,204"
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-12 text-slate-400">
          <p className="text-sm">Activity feed will appear here</p>
        </div>
      </div>
    </div>
  );
}
