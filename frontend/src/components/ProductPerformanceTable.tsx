import React from 'react';
import { Flame, Layers } from 'lucide-react';
import { TopProduct } from '../types/analytics';

interface ProductPerformanceProps {
  products: TopProduct[];
}

export const ProductPerformanceTable: React.FC<ProductPerformanceProps> = ({ products }) => {
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  const totalTopSales = products.reduce((acc, p) => acc + p.product_net_sales, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Top 5 Selling Products Performance
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by product-level Net Sales after proportional order-discount allocation
          </p>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Distribution</span>
        </div>
      </div>

      {/* Mobile Stacked View (< 640px) */}
      <div className="sm:hidden space-y-3 min-w-0">
        {products.map((product, idx) => {
          const pctContribution = totalTopSales > 0 ? (product.product_net_sales / totalTopSales) * 100 : 0;
          const totalDiscounts = product.item_discounts + product.allocated_order_discounts;

          return (
            <div
              key={product.product_name}
              className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2.5 min-w-0 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-xs sm:text-sm leading-tight break-words">{product.product_name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {product.order_count} orders containing item
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[11px] text-slate-300 font-medium flex-shrink-0 whitespace-nowrap">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-slate-400">Qty Sold:</span>
                <span className="font-semibold text-slate-200">
                  {product.quantity_sold} units {product.returned_quantity > 0 && <span className="text-rose-400 font-normal">(-{product.returned_quantity} returned)</span>}
                </span>
              </div>

              {/* Highlighted Primary Net Sales Bar */}
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex-shrink-0">Net Sales</span>
                <span className="font-bold text-emerald-400 text-sm truncate">{formatSar(product.product_net_sales)}</span>
              </div>

              {/* Secondary Financial Breakdown Grid (Gross, Discounts, Returns) */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-center min-w-0">
                  <span className="text-[9px] uppercase font-semibold text-slate-400 block truncate">Gross</span>
                  <span className="font-medium text-slate-200 text-[11px] block truncate leading-tight mt-0.5">{formatSar(product.gross_sales)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-center min-w-0">
                  <span className="text-[9px] uppercase font-semibold text-amber-400 block truncate">Discounts</span>
                  <span className="font-medium text-amber-400 text-[11px] block truncate leading-tight mt-0.5">{formatSar(totalDiscounts)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-center min-w-0">
                  <span className="text-[9px] uppercase font-semibold text-rose-400 block truncate">Returns</span>
                  <span className="font-medium text-rose-400 text-[11px] block truncate leading-tight mt-0.5">{formatSar(product.returns)}</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span>Share of Top Sales</span>
                  <span className="font-semibold text-emerald-400">{pctContribution.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(pctContribution, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th className="py-3 px-4 rounded-l-lg">Rank & Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Qty Sold</th>
              <th className="py-3 px-4 text-right">Gross Sales</th>
              <th className="py-3 px-4 text-right">Discounts</th>
              <th className="py-3 px-4 text-right">Returns</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Net Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((product, idx) => {
              const pctContribution = totalTopSales > 0 ? (product.product_net_sales / totalTopSales) * 100 : 0;
              return (
                <tr key={product.product_name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{product.product_name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {product.order_count} orders containing item
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 text-xs text-slate-300 font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                    {product.quantity_sold} {product.returned_quantity > 0 && <span className="text-xs text-rose-400">(-{product.returned_quantity})</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">{formatSar(product.gross_sales)}</td>
                  <td className="py-3.5 px-4 text-right text-amber-400 font-medium">
                    {formatSar(product.item_discounts + product.allocated_order_discounts)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-400 font-medium">
                    {formatSar(product.returns)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-emerald-400">
                        {formatSar(product.product_net_sales)}
                      </span>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(pctContribution, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
