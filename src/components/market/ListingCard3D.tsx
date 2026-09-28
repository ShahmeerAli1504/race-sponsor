'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ListingItem } from '@/types/market';
import { Zap, Clock, MapPin, Award, Building2, Flame, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';

interface ListingCard3DProps {
  listing: ListingItem;
}

export function ListingCard3D({ listing }: ListingCard3DProps) {
  // Mouse tracking 3D tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Ticking countdown clock
  const [timeRemainingStr, setTimeRemainingStr] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const closeDate = new Date(listing.bids_close_at);
      if (isAfter(now, closeDate)) {
        setIsEnded(true);
        setTimeRemainingStr('AUCTION CLOSED');
      } else {
        const diffMs = closeDate.getTime() - now.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / 1000 / 60) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);

        if (days > 0) {
          setTimeRemainingStr(`${days}d ${hours}h ${mins}m`);
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

  // Check if athlete is platform founder (Jaffet Corona)
  const isFounder = listing.athlete_id === 'a1111111-1111-1111-1111-111111111111' || listing.athlete.name === 'Jaffet Corona';
  const placementText = listing.placement_zone.replace('_', ' ').toUpperCase();

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl bg-surface border p-4 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isFounder
          ? 'border-volt/60 shadow-neon-volt hover:border-volt hover:shadow-[0_0_35px_rgba(212,255,0,0.5)]'
          : 'border-surface-border hover:border-volt/40 hover:shadow-card-glow'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(212,255,0,0.08),transparent_80%)]" />

      <div>
        {/* Card Header: Athlete Cover & Avatar */}
        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-surface-card border border-surface-border">
          {/* Cover Image / Image fallback */}
          {listing.athlete.cover_image_url ? (
            <Image
              src={listing.athlete.cover_image_url}
              alt={listing.athlete.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-highlight to-surface" />
          )}

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          {/* Target Event Badge or Founder Badge (Top Left) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            {isFounder && (
              <span className="bg-volt text-black px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold flex items-center gap-1 shadow-neon-volt">
                <Zap className="w-3 h-3 fill-black" />
                <span>FOUNDER</span>
              </span>
            )}
            <div className="bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-surface-border text-[11px] font-mono font-bold text-white flex items-center gap-1.5 shadow-md">
              <Award className="w-3.5 h-3.5 text-volt" />
              <span>{listing.event.title}</span>
            </div>
          </div>

          {/* Live Countdown Badge (Top Right) */}
          <div
            className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 ${
              isEnded
                ? 'bg-slate-900/90 text-slate-400 border-slate-700'
                : 'bg-race-orange/20 text-race-orange border-race-orange/50 animate-pulse'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeRemainingStr}</span>
          </div>

          {/* Athlete Avatar + Gym Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-surface ${
              isFounder ? 'border-volt shadow-neon-volt' : 'border-surface-border'
            }`}>
              <Image
                src={listing.athlete.avatar_url}
                alt={listing.athlete.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base leading-tight truncate group-hover:text-volt transition-colors">
                  {listing.athlete.name}
                </h3>
                {isFounder && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-volt/20 text-volt border border-volt/40">
                    OWNER
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mt-0.5 truncate">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-volt" />
                  {listing.athlete.hometown}
                </span>
                <span className="text-slate-600">•</span>
                <span className="truncate text-slate-400">{listing.athlete.home_gym}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Affiliation Banner (e.g., The Compound Coffee) */}
        {listing.athlete.business_affiliations && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border/80 flex items-center gap-2 text-xs font-mono text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Business Profile:</span>
            <span className="text-white font-semibold truncate">{listing.athlete.business_affiliations}</span>
          </div>
        )}

        {/* Listing Title & Placement Zone Pill */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-md bg-volt/10 text-volt border border-volt/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              {placementText} DECAL SLOT
            </span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-race-orange" />
              {listing.total_bids || 0} Bids
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
            {listing.title} — <span className="text-slate-400">{listing.decal_specs}</span>
          </p>
        </div>
      </div>

      {/* Pricing & Bid Action Footer */}
      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Current High Bid
          </div>
          <div className="text-lg font-mono font-extrabold text-volt flex items-baseline gap-1">
            ${listing.current_bid.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          {listing.highest_bidder_company && (
            <div className="text-[10px] text-cyan-400 font-mono truncate max-w-[140px]">
              By {listing.highest_bidder_company}
            </div>
          )}
        </div>

        <Link
          href={`/athletes/${listing.id}`}
          className="px-4 py-2 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-neon-volt transition-all group-hover:scale-105"
        >
          <span>BID NOW</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
