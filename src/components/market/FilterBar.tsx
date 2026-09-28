'use client';

import { useMarketStore } from '@/lib/store';
import { SportCategory, PlacementZone } from '@/types/market';
import { Search, Filter, RotateCcw, Flame, Trophy, Calendar, SlidersHorizontal } from 'lucide-react';

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useMarketStore();

  const sportsList: (SportCategory | 'All')[] = ['All', 'HYROX', 'CrossFit', 'Marathon', 'Triathlon', 'Combat'];
  const placementsList: (PlacementZone | 'All')[] = [
    'All',
    'shoulder_right',
    'shoulder_left',
    'chest',
    'back_singlet',
    'quad',
    'headwear',
    'social_only',
  ];

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Search Input + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by athlete name, gym (e.g. Grind Human), or event..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full bg-surface-card border border-surface-border rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-volt transition-colors"
          />
        </div>

        {/* Sort & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-mono text-xs">
          <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-volt" />
            <span className="text-slate-400 text-[11px]">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as any })}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="ending_soonest" className="bg-surface text-white">Ending Soonest</option>
              <option value="highest_bid" className="bg-surface text-white">Highest Lead Bid</option>
              <option value="lowest_starting_bid" className="bg-surface text-white">Lowest Starting Bid</option>
              <option value="most_bids" className="bg-surface text-white">Most Active Bids</option>
              <option value="newest" className="bg-surface text-white">Newest Listings</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="p-2 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sport Category Pills */}
      <div className="space-y-2 pt-2 border-t border-surface-border/60">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-volt" />
          <span>Filter By Athletic Discipline</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sportsList.map((sport) => (
            <button
              key={sport}
              onClick={() => setFilters({ sport })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                filters.sport === sport
                  ? 'bg-volt text-black border-volt shadow-neon-volt'
                  : 'bg-surface-card text-slate-300 border-surface-border hover:text-white hover:border-slate-500'
              }`}
            >
              {sport === 'All' ? '⚡ ALL SPORTS' : sport}
            </button>
          ))}
        </div>
      </div>

      {/* Placement Zone Pills */}
      <div className="space-y-2 pt-2 border-t border-surface-border/60">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-race-orange" />
          <span>Filter By Decal Placement Slot</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {placementsList.map((placement) => (
            <button
              key={placement}
              onClick={() => setFilters({ placement })}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                filters.placement === placement
                  ? 'bg-race-orange text-white border-race-orange shadow-neon-orange font-bold'
                  : 'bg-surface-card text-slate-400 border-surface-border hover:text-white hover:border-slate-500'
              }`}
            >
              {placement === 'All' ? 'ALL ZONES' : placement.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
