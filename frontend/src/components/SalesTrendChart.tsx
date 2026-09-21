import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { MonthlySales, DayOfWeekSales } from '../types/analytics';

interface SalesTrendChartProps {
  monthlyData: MonthlySales[];
  dayOfWeekData: DayOfWeekSales[];
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  monthlyData,
  dayOfWeekData,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'dow'>('monthly');

  const formattedMonthly = monthlyData.map((item) => {
    const [year, month] = item.yr_month.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString(
      'en-US',
      { month: 'short' }
    );
    return {
      ...item,
      label: `${monthName} ${year}`,
      NetSales: item.net_sales,
      Orders: item.counted_orders,
      AOV: item.average_order_value,
    };
  });

  const formattedDow = dayOfWeekData.map((item) => ({
    ...item,
    label: item.day_name.substring(0, 3),
    NetSales: item.net_sales,
    Orders: item.counted_orders,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-semibold text-white">
                {entry.name === 'NetSales'
                  ? `${entry.value.toLocaleString()} SAR`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Sales Trend & Pattern Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize financial progress over months and order velocity by day of week
          </p>
        </div>

        <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'monthly'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly Trend</span>
          </button>
          <button
            onClick={() => setViewMode('dow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'dow'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Day of Week</span>
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'monthly' ? (
            <AreaChart data={formattedMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="NetSales"
                name="Net Sales (SAR)"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#netSalesGrad)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="Orders"
                name="Order Count"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={formattedDow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Bar
                yAxisId="left"
                dataKey="NetSales"
                name="Net Sales (SAR)"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="Orders"
                name="Order Count"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
