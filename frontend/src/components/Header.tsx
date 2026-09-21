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
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Restaurant Sales Analytics
              </h1>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Mini System
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              لوحة تحليلات مبيعات المطعم — Executive Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${
            isLiveSupabase
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}
          title={isLiveSupabase ? 'Connected to live Supabase database views' : 'Displaying verified Phase 4 analytics dataset'}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isLiveSupabase ? 'Supabase Live' : 'Verified Dataset'}
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
};
