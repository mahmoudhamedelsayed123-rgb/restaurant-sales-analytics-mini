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

  const discountRatePct = kpis.total_gross_sales > 0
    ? ((kpis.total_discounts / kpis.total_gross_sales) * 100).toFixed(2)
    : '0.00';

  const returnRatePct = kpis.total_gross_sales > 0
    ? ((kpis.total_returns / kpis.total_gross_sales) * 100).toFixed(2)
    : '0.00';

  const realizationRatePct = kpis.total_gross_sales > 0
    ? ((kpis.total_net_sales / kpis.total_gross_sales) * 100).toFixed(1)
    : '0.0';

  const cards = [
    {
      title: 'Gross Sales',
      value: formatSar(kpis.total_gross_sales),
      subtitle: 'Sum of (quantity × unit_price_at_sale)',
      icon: DollarSign,
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
      badge: `${realizationRatePct}% Realized`,
    },
    {
      title: 'Total Discounts',
      value: formatSar(kpis.total_discounts),
      subtitle: `Item: ${formatSar(kpis.total_item_discounts)} | Order: ${formatSar(kpis.total_order_discounts)}`,
      icon: Tag,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      badge: `${discountRatePct}% of Gross`,
    },
    {
      title: 'Total Returns',
      value: formatSar(kpis.total_returns),
      subtitle: 'Line-item refunds & full returns',
      icon: RotateCcw,
      color: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
      badge: `${returnRatePct}% of Gross`,
    },
    {
      title: 'Net Sales',
      value: formatSar(kpis.total_net_sales),
      subtitle: 'Gross - Discounts - Returns',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      badge: 'Primary Financial Metric',
      highlight: true,
    },
    {
      title: 'Counted Orders',
      value: `${kpis.counted_orders.toLocaleString()} Orders`,
      subtitle: 'Completed, Returned & Partial (Excl. Cancelled)',
      icon: ShoppingCart,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      badge: 'Valid Sales Count',
    },
    {
      title: 'Average Order Value (AOV)',
      value: formatSar(kpis.average_order_value),
      subtitle: 'Net Sales / Counted Orders',
      icon: Award,
      color: 'from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/30',
      badge: `AOV: ${formatSar(kpis.average_order_value)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative p-4 sm:p-5 rounded-2xl border bg-slate-900/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${
              card.highlight
                ? 'border-emerald-500/40 ring-1 ring-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wide uppercase truncate block">
                  {card.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight truncate">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-xl border bg-gradient-to-br flex-shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-400">
              <span className="truncate min-w-0">{card.subtitle}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-medium text-slate-300 flex-shrink-0 whitespace-nowrap">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
