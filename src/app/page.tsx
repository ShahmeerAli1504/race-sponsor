'use client';

import { useMarketStore } from '@/lib/store';
import { InfiniteTicker } from '@/components/market/InfiniteTicker';
import { FilterBar } from '@/components/market/FilterBar';
import { ListingCard3D } from '@/components/market/ListingCard3D';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShieldCheck, Trophy, Flame, ArrowRight, UserPlus, Clock, Sparkles, MapPin, Instagram, Building2, Calendar, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const { listings, filters } = useMarketStore();

  // Jaffet Corona's featured listing (first/primary listing)
  const featuredListing = listings.find(
    (l) => l.athlete_id === 'a1111111-1111-1111-1111-111111111111'
  );

  // Apply search, sport, placement, and sorting filters
  const filteredListings = listings.filter((item) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = item.athlete.name.toLowerCase().includes(q);
      const matchGym = item.athlete.home_gym.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchEvent = item.event.title.toLowerCase().includes(q);
      if (!matchName && !matchGym && !matchTitle && !matchEvent) return false;
    }
    if (filters.sport !== 'All' && item.event.sport !== filters.sport) return false;
    if (filters.placement !== 'All' && item.placement_zone !== filters.placement) return false;
    return true;
  });

  filteredListings.sort((a, b) => {
    if (filters.sortBy === 'ending_soonest') return new Date(a.bids_close_at).getTime() - new Date(b.bids_close_at).getTime();
    if (filters.sortBy === 'highest_bid') return b.current_bid - a.current_bid;
    if (filters.sortBy === 'lowest_starting_bid') return a.starting_bid - b.starting_bid;
    if (filters.sortBy === 'most_bids') return (b.total_bids || 0) - (a.total_bids || 0);
    if (filters.sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const activeAuctionsCount = listings.filter((l) => l.status === 'ACTIVE').length;
  const totalVolume = listings.reduce((sum, l) => sum + l.current_bid, 0);

  return (
    <div className="space-y-0 pb-16 font-sans">
      {/* ═══════════════════════════════════════════════════════════════════
          JAFFET CORONA — FOUNDER & FEATURED ATHLETE HERO SPOTLIGHT
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-surface-border bg-gradient-to-b from-surface via-background to-background">
        {/* Ambient Grid Lines Background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1E2430_1px,transparent_1px),linear-gradient(to_bottom,#1E2430_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_70%,transparent_100%)] opacity-20" />

        {/* Volt glow accent behind the photo */}
        <div className="pointer-events-none absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-volt/5 blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* LEFT: Text Content */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Owner Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-volt/10 border border-volt/40 text-volt text-xs font-mono font-bold shadow-neon-volt">
                <Sparkles className="w-4 h-4 fill-volt/30" />
                <span>FOUNDER & FEATURED ATHLETE</span>
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] font-mono">
                MEET{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt via-volt-light to-volt">
                  JAFFET CORONA
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-lg sm:text-xl text-slate-300 font-semibold leading-snug">
                Athlete. Entrepreneur. Reno Native.
              </p>

              {/* Bio */}
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Born and raised in Reno, Nevada — Jaffet grew up playing soccer and competed at the college and semi-professional levels. That foundation of strength, discipline, and competitive mindset led him to a new challenge:{' '}
                <span className="text-white font-semibold">HYROX</span>. Today he trains at{' '}
                <span className="text-white font-semibold">Grind Human Performance</span> as he prepares to compete on December 6 in Anaheim, California.
              </p>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-white">
                  <MapPin className="w-3.5 h-3.5 text-volt" />
                  Reno, NV
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-white">
                  <Trophy className="w-3.5 h-3.5 text-race-orange" />
                  HYROX Athlete
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-white">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  The Compound Coffee
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-white">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Dec 6, 2026
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {featuredListing && (
                  <Link
                    href={`/athletes/${featuredListing.id}`}
                    className="px-7 py-3.5 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-neon-volt transition-all transform hover:scale-105"
                  >
                    <Zap className="w-5 h-5 fill-black" />
                    <span>SPONSOR JAFFET — BID NOW</span>
                  </Link>
                )}
                <a
                  href="https://www.instagram.com/_jayfetti11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-white font-mono font-bold text-sm flex items-center gap-2 transition-all hover:border-volt/50"
                >
                  <Instagram className="w-4 h-4 text-volt" />
                  <span>@_jayfetti11</span>
                </a>
              </div>
            </div>

            {/* RIGHT: Jaffet's Photo — Large Hero Portrait */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Neon glow ring behind the image */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-volt/30 via-volt/10 to-transparent blur-xl opacity-60" />
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-volt/40 via-transparent to-race-orange/20 opacity-40" />

                {/* Main Photo Container */}
                <div className="relative w-72 h-[380px] sm:w-80 sm:h-[420px] lg:w-[380px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-volt/50 shadow-neon-volt bg-surface-card">
                  <Image
                    src="/jeff.png"
                    alt="Jaffet Corona — Founder & Featured Athlete"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />

                  {/* Name overlay at bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-volt uppercase tracking-widest font-bold">Platform Owner</div>
                        <div className="text-lg font-extrabold text-white font-mono leading-tight">Jaffet Corona</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-volt/20 border border-volt/50 text-volt text-[10px] font-mono font-bold uppercase">
                        ⚡ LIVE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FROM COFFEE TO COMPETITION — Story Band
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-surface-border bg-surface-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-volt font-mono font-bold text-sm">
                <Trophy className="w-5 h-5" />
                <span>SOCCER TO HYROX</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                College and semi-pro soccer athlete turned elite HYROX competitor. Years of competitive sports built the discipline and conditioning that fuel his race-day performance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-race-orange font-mono font-bold text-sm">
                <Building2 className="w-5 h-5" />
                <span>THE COMPOUND COFFEE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Beyond training, Jaffet is building The Compound Coffee — growing as both an athlete and entrepreneur while representing the Reno community that shaped him.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                <Flame className="w-5 h-5" />
                <span>SPONSOR HIS RACE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Businesses can bid on sponsorship placement starting at <span className="text-volt font-bold">$50</span>. Your logo on Jaffet during HYROX Anaheim — plus social media recognition before, during, and after race day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          KEY METRICS RIBBON
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-surface-border font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-volt" />
                <span>Active Auctions</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1">{activeAuctionsCount} Active</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-race-orange" />
                <span>Current Total Lead</span>
              </div>
              <div className="text-2xl font-extrabold text-volt mt-1">${totalVolume.toFixed(2)}</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>14-Day Cutoff</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1">336 Hours Pre-Race</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Escrow</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1">100% Direct Contact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Hardware-Accelerated Marquee Ticker */}
      <InfiniteTicker />

      {/* ═══════════════════════════════════════════════════════════════════
          LIVE SPONSORSHIP AUCTIONS
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="auctions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-mono font-extrabold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-volt" />
              <span>LIVE SPONSORSHIP AUCTIONS</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Bid on available placement slots. All sponsorships include social media recognition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>Showing</span>
              <span className="px-2 py-0.5 rounded bg-volt/10 text-volt font-bold border border-volt/30">
                {filteredListings.length} Listings
              </span>
            </div>
            <Link
              href="/apply"
              className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all hover:border-volt/50"
            >
              <UserPlus className="w-3.5 h-3.5 text-volt" />
              <span>Apply as Athlete</span>
            </Link>
          </div>
        </div>

        <FilterBar />

        {filteredListings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-4 font-mono">
            <Zap className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Listings Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No athlete sponsor auctions match your active search or discipline filter. Try clearing filters or view all auctions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard3D key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
