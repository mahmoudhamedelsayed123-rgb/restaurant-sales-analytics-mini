import React from 'react';
import { DollarSign, Tag, RotateCcw, TrendingUp, ShoppingCart, Award } from 'lucide-react';
import { ExecutiveKpiSummary } from '../types/analytics';

interface KpiCardProps {
  kpis: ExecutiveKpiSummary;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpis }) => {
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  const cards = [
    {
      title: 'Gross Sales',
      value: formatSar(kpis.total_gross_sales),
      subtitle: 'Sum of quantity × unit price',
      icon: DollarSign,
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
      badge: '60,325.00 SAR',
    },
    {
      title: 'Total Discounts',
      value: formatSar(kpis.total_discounts),
      subtitle: `Item: ${kpis.total_item_discounts.toFixed(2)} | Order: ${kpis.total_order_discounts.toFixed(2)} SAR`,
      icon: Tag,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      badge: '1.06% of Gross',
    },
    {
      title: 'Total Returns',
      value: formatSar(kpis.total_returns),
      subtitle: 'Refunds & items returned',
      icon: RotateCcw,
      color: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
      badge: '3.86% of Gross',
    },
    {
      title: 'Net Sales',
      value: formatSar(kpis.total_net_sales),
      subtitle: 'Gross - Discounts - Returns',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      badge: 'Primary Metric',
      highlight: true,
    },
    {
      title: 'Counted Orders',
      value: `${kpis.counted_orders} Orders`,
      subtitle: 'Completed, Returned & Partial',
      icon: ShoppingCart,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      badge: 'Excludes Cancelled',
    },
    {
      title: 'Average Order Value (AOV)',
      value: formatSar(kpis.average_order_value),
      subtitle: 'Net Sales / Counted Orders',
      icon: Award,
      color: 'from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/30',
      badge: '157.13 SAR',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative p-5 rounded-2xl border bg-slate-900/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${
              card.highlight
                ? 'border-emerald-500/40 ring-1 ring-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {card.title}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border bg-gradient-to-br ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate pr-2">{card.subtitle}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-medium text-slate-300 flex-shrink-0">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
