'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Flame, Zap, UserPlus, MessageCircle } from 'lucide-react';
import { useMarketStore } from '@/lib/store';

export function Header() {
  const pathname = usePathname();
  const { listings } = useMarketStore();
  
  const activeListingsCount = listings.filter(l => l.status === 'ACTIVE').length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/90 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="w-full bg-gradient-to-r from-surface-card via-surface-hover to-surface-card border-b border-surface-border px-4 py-1.5 text-xs text-slate-300 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-volt animate-pulse" />
            <span className="text-volt font-semibold uppercase tracking-wider">Verified Inventory Model:</span>
            <span className="hidden sm:inline text-slate-400">Athletes vetted & published upon listing fee receipt. 2-Week pre-race hard bidding cutoff.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://wa.me/18007766767"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-volt flex items-center gap-1.5 transition-colors text-slate-300"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">WhatsApp Desk:</span>
              <span className="font-mono text-emerald-400">+1 (800) 776-6767</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-surface-card border border-volt/40 flex items-center justify-center shadow-neon-volt group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-volt fill-volt/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                RACE<span className="text-volt">SPONSOR</span>
              </span>
              <span className="bg-volt/10 text-volt text-[10px] font-mono px-1.5 py-0.5 rounded border border-volt/30 uppercase tracking-widest font-bold">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight">
              SkinBid Athletic Live Auction Terminal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              pathname === '/'
                ? 'bg-surface-hover text-volt font-semibold border border-volt/20'
                : 'text-slate-300 hover:text-white hover:bg-surface-card'
            }`}
          >
            <Flame className="w-4 h-4 text-race-orange" />
            <span>Auctions</span>
            <span className="bg-volt/10 text-volt text-xs px-1.5 py-0.5 rounded font-mono font-bold">
              {activeListingsCount}
            </span>
          </Link>

          <Link
            href="/apply"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              pathname === '/apply'
                ? 'bg-surface-hover text-volt font-semibold border border-volt/20'
                : 'text-slate-300 hover:text-white hover:bg-surface-card'
            }`}
          >
            <UserPlus className="w-4 h-4 text-volt" />
            <span>Athlete Intake</span>
          </Link>
        </nav>

        {/* Direct Guarantee Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="border border-surface-border bg-surface-card px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-white font-semibold leading-none">100% Direct Escrow Guarantee</div>
              <div className="text-[10px] text-slate-400 leading-tight">Admin Handled Handoff</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
