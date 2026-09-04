import { CalendarRange, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface BookingSummaryCardsProps {
  total: number;
  accepted: number;
  pending: number;
  cancelled: number;
}

interface CardConfig {
  key: string;
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
}

export default function BookingSummaryCards({
  total,
  accepted,
  pending,
  cancelled,
}: BookingSummaryCardsProps) {
  const cards: CardConfig[] = [
    {
      key: 'total',
      label: 'Total Bookings',
      value: total,
      description: 'All-time reservations',
      icon: <CalendarRange size={20} />,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      accent: 'from-sky-500/10 to-transparent',
    },
    {
      key: 'accepted',
      label: 'Accepted',
      value: accepted,
      description: 'Confirmed by center',
      icon: <CheckCircle2 size={20} />,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accent: 'from-emerald-500/10 to-transparent',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: pending,
      description: 'Awaiting confirmation',
      icon: <Clock size={20} />,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accent: 'from-amber-500/10 to-transparent',
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      value: cancelled,
      description: 'Cancelled by customer',
      icon: <XCircle size={20} />,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
      accent: 'from-slate-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 transition-all duration-300 hover:shadow-md hover:shadow-slate-200/60 hover:-translate-y-0.5 group"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
          />
          <div className="relative flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                {card.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">{card.description}</p>
            </div>
            <div
              className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} shrink-0 transition-transform duration-300 group-hover:scale-110`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
