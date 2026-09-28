'use client';

import { useState, useEffect } from 'react';
import { ListingItem, BidItem } from '@/types/market';
import { useMarketStore } from '@/lib/store';
import { SponsorBidModal } from './SponsorBidModal';
import { Zap, Clock, ShieldAlert, Trophy, ShieldCheck, Mail, MessageCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';

interface BiddingTerminalProps {
  listing: ListingItem;
}

export function BiddingTerminal({ listing }: BiddingTerminalProps) {
  const { bids } = useMarketStore();
  const listingBids: BidItem[] = bids[listing.id] || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncrement, setSelectedIncrement] = useState<number>(25);

  // Live countdown state
  const [timeRemainingStr, setTimeRemainingStr] = useState<string>('');
  const [isUnder60s, setIsUnder60s] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const closeDate = new Date(listing.bids_close_at);
      if (isAfter(now, closeDate)) {
        setIsEnded(true);
        setTimeRemainingStr('AUCTION CLOSED');
        setIsUnder60s(false);
      } else {
        const diffMs = closeDate.getTime() - now.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / 1000 / 60) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);

        if (diffMs < 60000) {
          setIsUnder60s(true);
        } else {
          setIsUnder60s(false);
        }

        if (days > 0) {
          setTimeRemainingStr(`${days}d ${hours}h ${mins}m ${secs}s`);
        } else {
          setTimeRemainingStr(
            `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
          );
        }
      }
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [listing.bids_close_at]);

  function handleOpenModalWithInc(inc: number) {
    setSelectedIncrement(inc);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="w-full space-y-6 lg:sticky lg:top-24 lg:self-start font-sans">
        {/* Main Terminal Box */}
        <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-volt animate-ping" />
              <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                Live Bidding Terminal
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-card border border-surface-border text-[10px] font-mono text-slate-400">
              SUPABASE REALTIME
            </span>
          </div>

          {/* Countdown Clock Bar */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center font-mono transition-all ${
              isEnded
                ? 'bg-slate-900 border-slate-700 text-slate-400'
                : isUnder60s
                ? 'bg-race-orange/20 border-race-orange text-race-orange animate-pulse shadow-neon-orange'
                : 'bg-surface-card border-surface-border text-white'
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
              <Clock className="w-4 h-4 text-volt" />
              <span>14-Day Pre-Race Hard Cutoff</span>
            </div>
            <div className="text-3xl font-extrabold text-volt tracking-tight">{timeRemainingStr}</div>
            <div className="text-[10px] text-slate-400 mt-1">
              Target Event: {listing.event.title}
            </div>
          </div>

          {/* Anti-Sniping Alert Banner */}
          <div className="p-3 rounded-xl bg-surface-card border border-surface-border/80 flex items-start gap-2.5 text-xs font-mono text-slate-300">
            <ShieldAlert className="w-4 h-4 text-volt flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-volt font-bold">Anti-Sniping Engine Active:</span> Any bid submitted within 60s of auction cutoff automatically extends the timer by +60 seconds.
              {listing.auto_extended_count ? (
                <span className="block text-race-orange mt-0.5">
                  ⚡ Auto-extended {listing.auto_extended_count} time(s) during live bidding!
                </span>
              ) : null}
            </div>
          </div>

          {/* Current Leading Bid Display */}
          <div className="p-4 rounded-xl bg-surface-card border border-volt/30 shadow-neon-volt space-y-1 font-mono">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Current High Bid</span>
              <Trophy className="w-4 h-4 text-volt" />
            </div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              ${listing.current_bid.toFixed(2)}
              <span className="text-xs text-slate-400 font-normal">USD</span>
            </div>
            <div className="text-xs text-cyan-400 font-bold pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Leading Sponsor: {listing.highest_bidder_company || 'No Bids Yet'}</span>
            </div>
          </div>

          {/* Quick Increment Buttons & Bid Trigger */}
          <div className="space-y-3 font-mono">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Quick Bid Increments
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((inc) => (
                <button
                  key={inc}
                  disabled={isEnded}
                  onClick={() => handleOpenModalWithInc(inc)}
                  className="py-2.5 px-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-volt text-white font-bold text-xs transition-all flex flex-col items-center justify-center disabled:opacity-40"
                >
                  <span className="text-volt">+${inc}</span>
                  <span className="text-[10px] text-slate-400">(${(listing.current_bid + inc).toFixed(0)})</span>
                </button>
              ))}
            </div>

            <button
              disabled={isEnded}
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-extrabold text-sm uppercase tracking-wider shadow-neon-volt transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{isEnded ? 'AUCTION CONCLUDED' : 'PLACE CUSTOM SPONSOR BID'}</span>
            </button>
          </div>

          {/* Live Real-time Bid Stream Feed */}
          <div className="space-y-3 pt-4 border-t border-surface-border">
            <div className="flex items-center justify-between font-mono">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Bid Stream ({listingBids.length})
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold">● Broadcast Live</span>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {listingBids.length === 0 ? (
                <div className="text-center py-6 text-xs font-mono text-slate-500">
                  No bids placed yet. Be the first corporate sponsor!
                </div>
              ) : (
                listingBids.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                      idx === 0
                        ? 'bg-volt/10 border-volt/40 text-white'
                        : 'bg-surface-card border-surface-border text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {idx === 0 && <span className="text-volt">👑</span>}
                        <span>{b.bidder_company}</span>
                        {b.is_anti_sniped && (
                          <span className="px-1.5 py-0.2 rounded bg-race-orange/20 text-race-orange text-[9px]">
                            +60s Anti-Sniped
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-volt">${b.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Direct Admin Support & Guarantee Box */}
        <div className="rounded-2xl bg-surface border border-surface-border p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Admin Contact & Handoff</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Upon auction close, platform admin connects winning sponsor directly with the athlete for vector logo handoff, decal sizing, and social deliverable timing.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-surface-border text-[11px]">
            <a
              href="mailto:support@racesponsor.com"
              className="flex items-center gap-2 text-slate-300 hover:text-volt transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-volt" />
              <span>support@racesponsor.com</span>
            </a>

            <a
              href="https://wa.me/18007766767"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +1 (800) 776-6767</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sponsor Bid Modal */}
      <SponsorBidModal
        listing={listing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultIncrement={selectedIncrement}
      />
    </>
  );
}
