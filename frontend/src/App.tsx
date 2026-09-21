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
import { ShieldCheck, Calendar, Info, Layers } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        isLiveSupabase={data?.isLiveSupabase ?? false}
        onRefresh={() => loadData(true)}
        isRefreshing={refreshing}
        onToggleMobileSidebar={() => setIsOpenMobile(true)}
      />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl text-rose-300 text-center my-8">
              <p className="font-bold text-lg">Error Loading Analytics</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => loadData(true)}
                className="mt-4 px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600"
              >
                Retry Loading
              </button>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Context Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Verified Restaurant Sales Analytics Mini System
                    </h2>
                    <p className="text-xs text-slate-400">
                      380 Seeded Orders • 968 Line Items • Zero Orphan Items • Verified Financial Formulas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Period: <strong className="text-white">June 1 – Aug 31, 2026</strong></span>
                </div>
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
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
                <div className="space-y-8">
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
                <div className="space-y-8">
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
                  Restaurant Sales Analytics Mini System — Academic AI Analytics Project
                </p>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Read-Only Supabase Architecture | Timezone: Asia/Riyadh (+03:00)</span>
                </div>
              </footer>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};
