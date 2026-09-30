import React from 'react';
import { Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { MonthlySales } from '../types/analytics';

interface MonthlyPerformanceProps {
  monthlyData: MonthlySales[];
}

export const MonthlyPerformanceTable: React.FC<MonthlyPerformanceProps> = ({ monthlyData }) => {
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  const getMonthName = (yrMonth: string) => {
    const [year, month] = yrMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Monthly Sales Performance
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            June 2026 - August 2026 Net Sales & Month-over-Month Growth
          </p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Overall Trend: Positive Growth</span>
        </div>
      </div>

      {/* Mobile Stacked View (< 640px) */}
      <div className="sm:hidden space-y-3">
        {monthlyData.map((row) => (
          <div
            key={row.yr_month}
            className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                {getMonthName(row.yr_month)}
              </div>
              {row.mom_growth_pct !== null ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  <ArrowUpRight className="w-3 h-3" />
                  +{row.mom_growth_pct.toFixed(2)}%
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-medium italic">Baseline</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
              <span className="text-slate-400">Orders & AOV:</span>
              <span className="font-semibold text-slate-200">
                {row.counted_orders} orders • AOV {formatSar(row.average_order_value)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Gross Sales</span>
                <span className="font-medium text-slate-200 mt-0.5 block leading-tight">{formatSar(row.gross_sales)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                <span className="text-[10px] uppercase font-semibold text-amber-400 block">Discounts</span>
                <span className="font-medium text-amber-400 mt-0.5 block leading-tight">{formatSar(row.total_discounts)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                <span className="text-[10px] uppercase font-semibold text-rose-400 block">Returns</span>
                <span className="font-medium text-rose-400 mt-0.5 block leading-tight">{formatSar(row.returns)}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-semibold text-emerald-400 block">Net Sales</span>
                <span className="font-bold text-emerald-400 mt-0.5 block leading-tight">{formatSar(row.net_sales)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table View (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th className="py-3 px-4 rounded-l-lg">Month</th>
              <th className="py-3 px-4 text-right">Gross Sales</th>
              <th className="py-3 px-4 text-right">Discounts</th>
              <th className="py-3 px-4 text-right">Returns</th>
              <th className="py-3 px-4 text-right">Net Sales</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">AOV</th>
              <th className="py-3 px-4 text-right rounded-r-lg">MoM Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {monthlyData.map((row) => (
              <tr key={row.yr_month} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {getMonthName(row.yr_month)}
                </td>
                <td className="py-3.5 px-4 text-right font-medium">{formatSar(row.gross_sales)}</td>
                <td className="py-3.5 px-4 text-right text-amber-400 font-medium">
                  {formatSar(row.total_discounts)}
                </td>
                <td className="py-3.5 px-4 text-right text-rose-400 font-medium">
                  {formatSar(row.returns)}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                  {formatSar(row.net_sales)}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                  <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700">
                    {row.counted_orders}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium">{formatSar(row.average_order_value)}</td>
                <td className="py-3.5 px-4 text-right">
                  {row.mom_growth_pct !== null ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{row.mom_growth_pct.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium italic">Baseline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-slate-500 block">June 2026 Baseline</span>
          <span className="font-semibold text-slate-200 text-sm">15,476.70 SAR</span> (107 orders, AOV 144.64 SAR)
        </div>
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-slate-500 block">July 2026 Growth</span>
          <span className="font-semibold text-emerald-400 text-sm">20,360.90 SAR</span> (+31.56% MoM)
        </div>
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-slate-500 block">August 2026 Peak</span>
          <span className="font-semibold text-emerald-400 text-sm">21,514.88 SAR</span> (+5.67% MoM, 140 orders)
        </div>
      </div>
    </div>
  );
};
