import {
  Wallet,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Hourglass,
} from 'lucide-react';
import type { PaymentSummary } from './paymentTypes';
import { formatCurrency } from './paymentTypes';

interface PaymentSummaryCardsProps {
  summary: PaymentSummary;
}

interface CardConfig {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
}

export default function PaymentSummaryCards({ summary }: PaymentSummaryCardsProps) {
  const cards: CardConfig[] = [
    {
      key: 'totalCollection',
      label: 'Total Collection',
      value: formatCurrency(summary.totalCollection),
      icon: <Wallet size={20} />,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      accent: 'from-sky-500/10 to-transparent',
    },
    {
      key: 'todayCollection',
      label: "Today's Collection",
      value: formatCurrency(summary.todayCollection),
      icon: <CalendarClock size={20} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      accent: 'from-blue-500/10 to-transparent',
    },
    {
      key: 'successfulPayments',
      label: 'Successful Payments',
      value: summary.successfulPayments.toLocaleString(),
      icon: <CheckCircle2 size={20} />,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accent: 'from-emerald-500/10 to-transparent',
    },
    {
      key: 'failedPayments',
      label: 'Failed Payments',
      value: summary.failedPayments.toLocaleString(),
      icon: <XCircle size={20} />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      accent: 'from-red-500/10 to-transparent',
    },
    {
      key: 'pendingPayments',
      label: 'Pending Payments',
      value: summary.pendingPayments.toLocaleString(),
      icon: <Clock size={20} />,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accent: 'from-amber-500/10 to-transparent',
    },
    {
      key: 'totalRefunded',
      label: 'Total Refunded',
      value: formatCurrency(summary.totalRefunded),
      icon: <RotateCcw size={20} />,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      accent: 'from-violet-500/10 to-transparent',
    },
    {
      key: 'pendingRefunds',
      label: 'Pending Refunds',
      value: summary.pendingRefunds.toLocaleString(),
      icon: <Hourglass size={20} />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      accent: 'from-orange-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{card.value}</p>
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
