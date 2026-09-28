'use client';

import { useState } from 'react';
import { ListingItem } from '@/types/market';
import { useMarketStore } from '@/lib/store';
import { Zap, X, ShieldCheck, DollarSign, Building2, User, Mail, Phone, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsorBidModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  defaultIncrement?: number;
}

export function SponsorBidModal({
  listing,
  isOpen,
  onClose,
  defaultIncrement = 25,
}: SponsorBidModalProps) {
  const { placeBid } = useMarketStore();

  const minAllowedBid = listing.current_bid + 1;
  const initialBidAmount = listing.current_bid + defaultIncrement;

  const [bidderName, setBidderName] = useState('');
  const [bidderCompany, setBidderCompany] = useState('');
  const [bidderEmail, setBidderEmail] = useState('');
  const [bidderPhone, setBidderPhone] = useState('');
  const [amount, setAmount] = useState<number>(initialBidAmount);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function handleQuickIncrement(inc: number) {
    const newAmt = listing.current_bid + inc;
    setAmount(newAmt);
    setErrorMsg(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!bidderName.trim() || !bidderCompany.trim() || !bidderEmail.trim() || !bidderPhone.trim()) {
      setErrorMsg('Please fill in all corporate sponsor contact fields.');
      return;
    }

    if (amount <= listing.current_bid) {
      setErrorMsg(`Bid amount must be strictly greater than $${listing.current_bid.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = placeBid({
        listing_id: listing.id,
        bidder_name: bidderName.trim(),
        bidder_company: bidderCompany.trim(),
        bidder_email: bidderEmail.trim(),
        bidder_phone: bidderPhone.trim(),
        amount: Number(amount),
      });

      setIsSubmitting(false);

      if (result.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#FF5500', '#00F0FF'],
        });
        onClose();
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-surface-border p-6 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-surface-card border border-surface-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-volt/10 border border-volt/30 flex items-center justify-center text-volt shadow-neon-volt">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono leading-tight">
              Place Sponsor Bid
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {listing.athlete.name} • {listing.placement_zone.replace('_', ' ').toUpperCase()} Slot
            </p>
          </div>
        </div>

        {/* Current High Bid Callout */}
        <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Current Lead Bid</div>
            <div className="text-xl font-extrabold text-volt">${listing.current_bid.toFixed(2)} USD</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Minimum Next Bid</div>
            <div className="text-sm font-bold text-white">${minAllowedBid.toFixed(2)} USD</div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-race-orange/10 border border-race-orange/40 text-race-orange text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* Quick Increment Buttons */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 font-bold mb-2">
              QUICK BID INCREMENT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleQuickIncrement(inc)}
                  className={`py-2 px-3 rounded-lg font-mono text-xs font-bold border transition-all ${
                    amount === listing.current_bid + inc
                      ? 'bg-volt text-black border-volt shadow-neon-volt'
                      : 'bg-surface-card text-slate-300 border-surface-border hover:text-white hover:border-slate-500'
                  }`}
                >
                  +${inc} (${(listing.current_bid + inc).toFixed(0)})
                </button>
              ))}
            </div>
          </div>

          {/* Bid Amount Input */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 font-bold mb-1">
              YOUR BID AMOUNT (USD)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-volt absolute left-3 top-3" />
              <input
                type="number"
                step="5"
                min={minAllowedBid}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-4 text-white font-mono font-bold text-base focus:outline-none focus:border-volt"
                required
              />
            </div>
          </div>

          {/* Corporate Sponsor Contact Info */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <div className="text-[11px] font-mono text-slate-300 font-bold uppercase">
              Sponsor Corporate Verification Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Contact Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Michael Stone"
                    value={bidderName}
                    onChange={(e) => setBidderName(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-lg py-2 pl-8 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Company / Brand Name</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Performance Labs"
                    value={bidderCompany}
                    onChange={(e) => setBidderCompany(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-lg py-2 pl-8 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="sponsor@brand.com"
                    value={bidderEmail}
                    onChange={(e) => setBidderEmail(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-lg py-2 pl-8 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Phone / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+1 (775) 555-0192"
                    value={bidderPhone}
                    onChange={(e) => setBidderPhone(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-lg py-2 pl-8 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Direct Protection Guarantee Note */}
          <div className="p-3 rounded-lg bg-surface-card border border-surface-border/80 flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              If you win, our admin desk directly connects you with the athlete for vector logo decal placement & social coordination.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-extrabold text-sm uppercase tracking-wider shadow-neon-volt transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{isSubmitting ? 'BROADCASTING BID...' : `CONFIRM $${amount.toFixed(2)} BID`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
