import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { KpiCard } from './components/KpiCard';
import { MonthlyPerformanceTable } from './components/MonthlyPerformanceTable';
import { SalesTrendChart } from './components/SalesTrendChart';
import { ChannelBreakdownChart } from './components/ChannelBreakdownChart';
import { ProductPerformanceTable } from './components/ProductPerformanceTable';
import { OrderStatusChart } from './components/OrderStatusChart';
import { CustomerInsights } from './components/CustomerInsights';
import { ReturnsDiscountsCard } from './components/ReturnsDiscountsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchDashboardAnalytics } from './services/analyticsService';
import { DashboardData } from './types/analytics';
import { ShieldCheck, Calendar, Layers, AlertCircle, Database } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await fetchDashboardAnalytics();
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalOrders = 836;
  const totalLineItems = 2163;
  const countedOrders = data?.executiveKpis?.counted_orders ?? 804;
  const netSales = data?.executiveKpis?.total_net_sales ?? 128246.73;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Top Header */}
      <Header
        isLiveSupabase={data?.isLiveSupabase ?? false}
        onRefresh={() => loadData(true)}
        isRefreshing={refreshing}
        onToggleMobileSidebar={() => setIsOpenMobile(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          datasetPeriod="June 1 – Nov 21, 2026"
          periodSubtitle="6 Months (Nov Partial: 21d)"
          netSales={netSales}
          countedOrders={countedOrders}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full min-w-0">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl text-rose-300 text-center my-8 shadow-xl">
                <p className="font-bold text-lg">Error Loading Analytics</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => loadData(true)}
                  className="mt-4 px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : data ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Offline Warning Banner (Shown ONLY when not connected to Live Supabase) */}
                {!data.isLiveSupabase && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-300 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>
                        <strong>Offline Fallback Mode:</strong> Displaying verified static V1.1 analytical snapshot. Live Supabase connection is currently inactive.
                      </span>
                    </div>
                    <button
                      onClick={() => loadData(true)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold rounded-lg transition-colors"
                    >
                      Reconnect
                    </button>
                  </div>
                )}

                {/* Context Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-md">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="p-2 sm:p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                          Restaurant Sales Analytics Mini System — Production Release V1.1
                        </h2>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug truncate sm:whitespace-normal">
                        {totalOrders.toLocaleString()} Total Orders ({countedOrders} Counted, 32 Cancelled) • {totalLineItems.toLocaleString()} Line Items • 0 Orphan Items • 100% Financial Reconciliation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 bg-slate-950/60 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>
                      Period: <strong className="text-white">June 1 – Nov 21, 2026</strong>{' '}
                      <span className="text-[10px] sm:text-[11px] text-amber-300 font-medium">(Nov Partial: 21d)</span>
                    </span>
                  </div>
                </div>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Executive KPI Cards */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                          A. Executive KPI Summary Cards
                        </h2>
                      </div>
                      <KpiCard kpis={data.executiveKpis} />
                    </section>

                    {/* Monthly Performance & Trend */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <SalesTrendChart
                          monthlyData={data.monthlySales}
                          dayOfWeekData={data.dayOfWeekSales}
                        />
                      </div>
                      <div>
                        <ChannelBreakdownChart channels={data.salesChannels} />
                      </div>
                    </section>

                    {/* Monthly Performance Table */}
                    <section>
                      <MonthlyPerformanceTable monthlyData={data.monthlySales} />
                    </section>

                    {/* Financial Depth: Returns & Discounts */}
                    <section>
                      <ReturnsDiscountsCard
                        returnsData={data.returnsAnalysis}
                        discountsData={data.discountAnalysis}
                      />
                    </section>
                  </div>
                )}

                {/* Tab: Products & Channels */}
                {activeTab === 'products' && (
                  <div className="space-y-6 sm:space-y-8">
                    <section>
                      <ProductPerformanceTable products={data.topProducts} />
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChannelBreakdownChart channels={data.salesChannels} />
                      <OrderStatusChart statusSummary={data.orderStatusSummary} />
                    </section>
                  </div>
                )}

                {/* Tab: Customers & Financials */}
                {activeTab === 'customers' && (
                  <div className="space-y-6 sm:space-y-8">
                    <section>
                      <CustomerInsights
                        topCustomers={data.topCustomers}
                        customerBehavior={data.customerBehavior}
                      />
                    </section>

                    <section>
                      <ReturnsDiscountsCard
                        returnsData={data.returnsAnalysis}
                        discountsData={data.discountAnalysis}
                      />
                    </section>
                  </div>
                )}

                {/* Footer Notice */}
                <footer className="pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p>
                    Restaurant Sales Analytics Mini System V1.1 — Academic AI Analytics Project
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supabase PostgreSQL 17 | Timezone: Asia/Riyadh (+03:00)</span>
                  </div>
                </footer>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};
