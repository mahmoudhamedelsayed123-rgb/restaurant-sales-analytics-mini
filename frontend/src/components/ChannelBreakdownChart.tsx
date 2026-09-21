import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Store, UtensilsCrossed, ShoppingBag, Truck } from 'lucide-react';
import { SalesChannel } from '../types/analytics';

interface ChannelBreakdownProps {
  channels: SalesChannel[];
}

export const ChannelBreakdownChart: React.FC<ChannelBreakdownProps> = ({ channels }) => {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'dine-in':
        return UtensilsCrossed;
      case 'takeaway':
        return ShoppingBag;
      case 'delivery':
        return Truck;
      default:
        return Store;
    }
  };

  const chartData = channels.map((c) => ({
    name: c.sales_channel,
    value: c.net_sales,
    pct: c.pct_of_net_sales,
    orders: c.counted_orders,
  }));

  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + ' SAR';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Sales Channels Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Distribution across Dine-in, Takeaway, and Delivery
        </p>

        {/* Donut Chart */}
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${Number(value).toLocaleString()} SAR`, 'Net Sales']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards breakdown */}
      <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-800">
        {channels.map((channel, idx) => {
          const Icon = getIcon(channel.sales_channel);
          const color = COLORS[idx % COLORS.length];

          return (
            <div
              key={channel.sales_channel}
              className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg border"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}30`,
                    color: color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    {channel.sales_channel}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {channel.counted_orders} orders • AOV {formatSar(channel.average_order_value)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">{formatSar(channel.net_sales)}</p>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {channel.pct_of_net_sales}% of net
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
