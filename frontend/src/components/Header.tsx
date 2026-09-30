import React from 'react';
import { Utensils, RefreshCw, Database, CheckCircle2, Globe, Clock, Menu } from 'lucide-react';

interface HeaderProps {
  isLiveSupabase: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLiveSupabase,
  onRefresh,
  isRefreshing,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex-shrink-0">
            <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap min-w-0">
              <h1 className="text-sm xs:text-base lg:text-lg font-bold text-white tracking-tight leading-tight min-w-0">
                Restaurant Sales Analytics
              </h1>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                Mini System
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate leading-tight mt-0.5">
              <span className="hidden sm:inline">لوحة تحليلات مبيعات المطعم — </span>Executive Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* System Badges */}
        <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-slate-300">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Currency: <strong className="text-white">SAR</strong></span>
          <span className="text-slate-600">|</span>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Timezone: <strong className="text-white">+03:00</strong></span>
        </div>

        {/* Database Connection Status Indicator */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors ${
            isLiveSupabase
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}
          title={isLiveSupabase ? 'Connected to live Supabase database views' : 'Displaying verified Phase 4 analytics dataset'}
        >
          <Database className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">
            {isLiveSupabase ? 'Supabase Live' : 'Verified Dataset'}
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-2.5 sm:px-3 py-1.5 transition-colors disabled:opacity-50 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          title="Refresh analytics data"
          aria-label="Refresh analytics data"
        >
          <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
};
