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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
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

      <div className="overflow-x-auto">
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
