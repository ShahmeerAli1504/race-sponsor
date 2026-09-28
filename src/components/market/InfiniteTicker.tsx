'use client';

import { Zap, Clock, TrendingUp, Award, ShieldAlert } from 'lucide-react';
import { useMarketStore } from '@/lib/store';

export function InfiniteTicker() {
  const { listings } = useMarketStore();

  // Create ticker items from real listings
  const tickerItems = [
    {
      type: 'cutoff',
      icon: Clock,
      color: 'text-race-orange',
      text: 'HYROX Anaheim 2026: 14-Day Pre-Race Hard Cutoff on Bids (Closes Nov 22)',
    },
    {
      type: 'sniping',
      icon: ShieldAlert,
      color: 'text-volt',
      text: 'Anti-Sniping Engine: Any bid placed within 60s extends timer by +60 seconds',
    },
    {
      type: 'athlete',
      icon: Award,
      color: 'text-volt',
      text: 'Featured Founder: Jaffet Corona — HYROX Anaheim Right Deltoid Decal Slot (Dec 6, 2026)',
    },
    ...listings.map((l) => ({
      type: 'listing',
      icon: Zap,
      color: 'text-volt',
      text: `${l.athlete.name} (${l.athlete.home_gym}) - ${l.event.title} [${l.placement_zone.replace('_', ' ').toUpperCase()}] Opening Bid: $${l.starting_bid.toFixed(2)}`,
    })),
  ];

  return (
    <div className="w-full bg-surface-card border-y border-surface-border overflow-hidden py-2.5 select-none font-mono text-xs">
      <div className="flex w-max animate-marquee gap-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 text-slate-300 whitespace-nowrap px-4 border-r border-surface-border/50">
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
