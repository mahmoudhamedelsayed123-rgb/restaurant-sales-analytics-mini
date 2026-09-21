import React from 'react';
import { Users, UserCheck, UserX, Award, MapPin } from 'lucide-react';
import { TopCustomer, CustomerBehaviorSummary } from '../types/analytics';

interface CustomerInsightsProps {
  topCustomers: TopCustomer[];
  customerBehavior: CustomerBehaviorSummary;
}

export const CustomerInsights: React.FC<CustomerInsightsProps> = ({
  topCustomers,
  customerBehavior,
}) => {
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer Behavior Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Customer Engagement
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Registered loyalty customers vs anonymous walk-in sales
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Registered Loyalty Orders</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {customerBehavior.registered_customer_orders} Orders
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${customerBehavior.registered_pct}%` }}
                />
              </div>
              <p className="text-right text-[11px] text-indigo-300/80 font-medium mt-1">
                {customerBehavior.registered_pct}% of total volume
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs">
                  <UserX className="w-4 h-4 text-slate-400" />
                  <span>Anonymous Walk-in Orders</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {customerBehavior.anonymous_walkin_orders} Orders
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full"
                  style={{ width: `${customerBehavior.anonymous_pct}%` }}
                />
              </div>
              <p className="text-right text-[11px] text-slate-400 font-medium mt-1">
                {customerBehavior.anonymous_pct}% of total volume
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 font-medium">Repeat Customers</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            {customerBehavior.repeat_customers_count} Customers (&gt;1 order)
          </span>
        </div>
      </div>

      {/* Top 5 Registered Customers Table */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Top 5 Registered Customers
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by Net Sales contribution & frequency
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 rounded-l-lg">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Gross</th>
                <th className="py-3 px-4 text-right">AOV</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Net Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topCustomers.map((cust, idx) => (
                <tr key={cust.customer_name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-400 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-white">{cust.customer_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {cust.city}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs">
                      {cust.counted_orders} orders
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">{formatSar(cust.gross_sales)}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                    {formatSar(cust.average_order_value)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    {formatSar(cust.net_sales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
