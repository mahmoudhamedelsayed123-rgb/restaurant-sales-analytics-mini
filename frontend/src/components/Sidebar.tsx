import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Calendar, DollarSign, X } from 'lucide-react';

export type TabType = 'overview' | 'products' | 'customers';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Executive Overview',
      subtitle: 'KPIs & Sales Performance',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as TabType,
      label: 'Products & Channels',
      subtitle: 'Top items & fulfillment',
      icon: ShoppingBag,
    },
    {
      id: 'customers' as TabType,
      label: 'Customers & Financials',
      subtitle: 'Discounts, returns & loyalty',
      icon: Users,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-slate-800">
        <span className="text-sm font-semibold text-slate-300">Navigation Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 px-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Dataset Period
        </p>
        <div className="mt-2 p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-slate-200">Jun 1 - Aug 31, 2026</p>
            <p className="text-[11px] text-slate-400">3 Full Calendar Months</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Dashboard Sections
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onCloseMobile();
              }}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <div>
                <p className="text-sm font-medium leading-none">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800/80 px-2">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Verified Analytics</p>
            <p className="text-slate-400">Net Sales: 57,352.48 SAR</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-slate-900/60 border-r border-slate-800 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl border-r border-slate-800 z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
