import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClipboardList, CheckCircle2, RotateCcw, AlertTriangle, XCircle } from 'lucide-react';
import { OrderStatusSummary } from '../types/analytics';

interface OrderStatusProps {
  statusSummary: OrderStatusSummary[];
}

export const OrderStatusChart: React.FC<OrderStatusProps> = ({ statusSummary }) => {
  const STATUS_COLORS: Record<string, string> = {
    Completed: '#10b981',
    'Partially Returned': '#f59e0b',
    Cancelled: '#ef4444',
    Returned: '#8b5cf6',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return CheckCircle2;
      case 'Partially Returned':
        return AlertTriangle;
      case 'Returned':
        return RotateCcw;
      case 'Cancelled':
        return XCircle;
      default:
        return ClipboardList;
    }
  };

  const chartData = statusSummary.map((s) => ({
    name: s.order_status,
    value: s.order_count,
    pct: s.pct_of_total_orders,
  }));

  const totalOrders = statusSummary.reduce((acc, s) => acc + s.order_count, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Order Status Breakdown
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Distribution across total 380 seeded orders (including 15 Cancelled)
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
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={STATUS_COLORS[entry.name] || '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} Orders`, 'Count']}
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

      <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-800">
        {statusSummary.map((status) => {
          const Icon = getStatusIcon(status.order_status);
          const color = STATUS_COLORS[status.order_status] || '#64748b';

          return (
            <div
              key={status.order_status}
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
                    {status.order_status}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {status.order_status === 'Cancelled' ? 'Zero net sales contribution' : 'Included in financial analytics'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">{status.order_count} Orders</p>
                <span className="text-[11px] font-semibold text-slate-400">
                  {status.pct_of_total_orders}% of total ({totalOrders})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
