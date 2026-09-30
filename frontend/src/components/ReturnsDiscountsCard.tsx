import React from 'react';
import { Tag, RotateCcw, Percent, AlertCircle } from 'lucide-react';
import { ReturnsAnalysis, DiscountAnalysis } from '../types/analytics';

interface ReturnsDiscountsProps {
  returnsData: ReturnsAnalysis;
  discountsData: DiscountAnalysis;
}

export const ReturnsDiscountsCard: React.FC<ReturnsDiscountsProps> = ({
  returnsData,
  discountsData,
}) => {
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Discount Structure Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Tag className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              Discount Structure Analysis
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg flex-shrink-0 whitespace-nowrap">
            {discountsData.discount_rate_pct_of_gross}% of Gross
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-300">Item-Level Discounts</p>
              <p className="text-[11px] text-slate-400">
                Applied to specific menu items ({discountsData.orders_with_item_discounts} orders)
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-400 flex-shrink-0 whitespace-nowrap">
              {formatSar(discountsData.total_item_discounts)}
            </p>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-300">Order-Level Discounts</p>
              <p className="text-[11px] text-slate-400">
                Applied to header total ({discountsData.orders_with_order_discounts} orders)
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-400 flex-shrink-0 whitespace-nowrap">
              {formatSar(discountsData.total_order_discounts)}
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Percent className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs font-bold text-white truncate">Total Discounts Combined</p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-300 flex-shrink-0 whitespace-nowrap">
              {formatSar(discountsData.total_discounts)}
            </p>
          </div>
        </div>
      </div>

      {/* Returns & Refund Operational Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <RotateCcw className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              Returns & Refund Impact
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-lg flex-shrink-0 whitespace-nowrap">
            {returnsData.return_rate_pct_of_gross}% Return Rate
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-300">Full Order Returns</p>
              <p className="text-[11px] text-slate-400">
                Entire order refunded ({returnsData.full_return_orders} orders)
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-rose-400 flex-shrink-0 whitespace-nowrap">
              {returnsData.full_return_orders} Orders
            </p>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-300">Partial Item Returns</p>
              <p className="text-[11px] text-slate-400">
                Single menu items returned ({returnsData.partial_return_orders} orders)
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-rose-400 flex-shrink-0 whitespace-nowrap">
              {returnsData.partial_return_orders} Orders
            </p>
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <p className="text-xs font-bold text-white truncate">Total Monetary Return Amount</p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-rose-300 flex-shrink-0 whitespace-nowrap">
              {formatSar(returnsData.total_return_amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
