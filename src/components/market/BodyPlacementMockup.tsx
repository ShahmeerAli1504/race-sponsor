'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlacementZone, ListingItem } from '@/types/market';
import { useMarketStore } from '@/lib/store';
import { SponsorBidModal } from './SponsorBidModal';
import { Shield, Sparkles, Eye, Zap, Flame, Check } from 'lucide-react';

interface BodyPlacementMockupProps {
  selectedZone: PlacementZone;
  onSelectZone?: (zone: PlacementZone) => void;
  decalSpecs?: string;
  athleteListings?: ListingItem[];
}

interface HotspotConfig {
  zone: PlacementZone;
  label: string;
  shortLabel: string;
  top: string;
  left: string;
}

export function BodyPlacementMockup({
  selectedZone: initialZone,
  onSelectZone,
  decalSpecs = '4x4 inches High-Adhesion Sweatproof Temporary Tattoo Decal',
}: BodyPlacementMockupProps) {
  const { listings } = useMarketStore();
  const [view, setView] = useState<'front' | 'back'>('front');
  const [activeZone, setActiveZone] = useState<PlacementZone>(initialZone);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalListing, setModalListing] = useState<ListingItem | null>(null);

  function getListingForZone(zone: PlacementZone): ListingItem | undefined {
    return listings.find((l) => l.placement_zone === zone) || listings[0];
  }

  function handleZoneClick(zone: PlacementZone) {
    setActiveZone(zone);
    if (onSelectZone) {
      onSelectZone(zone);
    }
  }

  function handleOpenBid(zone: PlacementZone, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setActiveZone(zone);
    if (onSelectZone) onSelectZone(zone);
    const targetListing = getListingForZone(zone);
    if (targetListing) {
      setModalListing(targetListing);
      setIsModalOpen(true);
    }
  }

  const zoneMetadata: Record<
    PlacementZone,
    { title: string; desc: string; visibility: string; broadcastRating: string; side: 'front' | 'back' | 'both' }
  > = {
    shoulder_right: {
      title: 'Right Deltoid / Shoulder Slot',
      desc: 'High-visibility lateral camera angle. Supreme exposure during HYROX sled pushes, barbell movements, and victory podium photos.',
      visibility: '98% Camera Stream Coverage',
      broadcastRating: 'Tier 1 Prime',
      side: 'both',
    },
    shoulder_left: {
      title: 'Left Deltoid / Shoulder Slot',
      desc: 'Lateral camera angle with prime exposure during arm swings, running strides, and podium stance photos.',
      visibility: '95% Stream Visibility',
      broadcastRating: 'Tier 1 Prime',
      side: 'both',
    },
    chest: {
      title: 'Center Chest Singlet Patch',
      desc: 'Direct head-on broadcast framing. Supreme visibility during finish line sprint photos and broadcast interviews.',
      visibility: '99% Frontal Broadcast Coverage',
      broadcastRating: 'Tier 1 Apex',
      side: 'front',
    },
    back_singlet: {
      title: 'Back Aero Singlet Patch',
      desc: 'Prime trailing camera placement. Ideal for running pacing packs, sled pulls, and long endurance broadcasts.',
      visibility: '94% Endurance Stream Exposure',
      broadcastRating: 'Tier 1 Prime',
      side: 'back',
    },
    quad: {
      title: 'Quad / Fight Shorts Slot',
      desc: 'Low-center placement with extreme motion tracking visibility during burpees, wall balls, and lunges.',
      visibility: '90% Action Focus Coverage',
      broadcastRating: 'Tier 2 High-Impression',
      side: 'both',
    },
    headwear: {
      title: 'Headband / Cap / Helmet Slot',
      desc: 'Eye-level framing on close-up broadcasts, sweat-drenched grit closeups, and pre-race interviews.',
      visibility: '96% Close-up Coverage',
      broadcastRating: 'Tier 1 Prime',
      side: 'both',
    },
    social_only: {
      title: 'Bundled Social Shoutouts Only',
      desc: 'Dedicated Instagram Stories, Feed Posts, & Reels tag in bio without on-body decal placement.',
      visibility: 'Digital Feed Targeted',
      broadcastRating: 'Social Tier',
      side: 'both',
    },
  };

  // Hotspots for FRONT real athlete photo
  const frontHotspots: HotspotConfig[] = [
    { zone: 'headwear', label: 'Headband / Cap', shortLabel: 'HEADWEAR', top: '10%', left: '50%' },
    { zone: 'shoulder_right', label: 'Right Deltoid', shortLabel: 'R. SHOULDER', top: '26%', left: '30%' },
    { zone: 'shoulder_left', label: 'Left Deltoid', shortLabel: 'L. SHOULDER', top: '26%', left: '70%' },
    { zone: 'chest', label: 'Center Chest', shortLabel: 'CHEST', top: '30%', left: '50%' },
    { zone: 'quad', label: 'Right Quad', shortLabel: 'R. QUAD', top: '56%', left: '42%' },
    { zone: 'quad', label: 'Left Quad', shortLabel: 'L. QUAD', top: '56%', left: '58%' },
  ];

  // Hotspots for BACK real athlete photo
  const backHotspots: HotspotConfig[] = [
    { zone: 'headwear', label: 'Headband (Rear)', shortLabel: 'HEADWEAR', top: '9%', left: '50%' },
    { zone: 'shoulder_right', label: 'Right Deltoid', shortLabel: 'R. DELTOID', top: '26%', left: '30%' },
    { zone: 'shoulder_left', label: 'Left Deltoid', shortLabel: 'L. DELTOID', top: '26%', left: '70%' },
    { zone: 'back_singlet', label: 'Back Aero Singlet', shortLabel: 'BACK SINGLET', top: '33%', left: '50%' },
    { zone: 'quad', label: 'Hamstrings / Shorts', shortLabel: 'SHORTS (REAR)', top: '56%', left: '50%' },
  ];

  const currentHotspots = view === 'front' ? frontHotspots : backHotspots;
  const activeMeta = zoneMetadata[activeZone] || zoneMetadata.shoulder_right;
  const currentZoneListing = getListingForZone(activeZone);

  return (
    <>
      <div className="w-full rounded-2xl bg-surface border border-surface-border p-5 sm:p-6 shadow-xl space-y-6 font-sans">
        {/* Header with Anatomical View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Shield className="w-5 h-5 text-volt" />
              <span>INTERACTIVE ON-BODY SPONSORSHIP MAP</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real athlete front &amp; back photos with clickable on-body bidding hotspots
            </p>
          </div>

          {/* FRONT / BACK View Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-card border border-surface-border font-mono text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setView('front')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                view === 'front'
                  ? 'bg-volt text-black shadow-neon-volt'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>FRONT VIEW</span>
            </button>
            <button
              type="button"
              onClick={() => setView('back')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                view === 'back'
                  ? 'bg-volt text-black shadow-neon-volt'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>BACK VIEW</span>
            </button>
          </div>
        </div>

        {/* Real Photo Canvas + Right Side Detail Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Real Athlete Photo with Overlaid Interactive Hotspots */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-5 bg-surface-card rounded-2xl border border-surface-border relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,255,0,0.08),transparent_70%)]" />

            {/* View Pill */}
            <div className="w-full flex items-center justify-between z-20 font-mono text-[11px] mb-3 px-1">
              <span className="px-3 py-1 rounded-full bg-background/80 border border-surface-border text-slate-300 backdrop-blur-md">
                Athlete: <strong className="text-white">Jaffet Corona</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-volt/10 border border-volt/40 text-volt font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                {view === 'front' ? 'ANTERIOR (FRONT VIEW)' : 'POSTERIOR (BACK VIEW)'}
              </span>
            </div>

            {/* Athlete Photo Container */}
            <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-2xl overflow-hidden border border-surface-border/80 bg-black/60 shadow-2xl select-none">
              <Image
                src={view === 'front' ? '/athlete-front.jpg' : '/athlete-back.jpg'}
                alt={view === 'front' ? 'Athlete Front View' : 'Athlete Back View'}
                fill
                priority
                className="object-cover object-center"
              />

              {/* Vignette Overlay to enhance badge contrast */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30" />

              {/* Hotspots Placed Directly On The Body */}
              {currentHotspots.map((spot, index) => {
                const isSelected = activeZone === spot.zone;
                const spotListing = getListingForZone(spot.zone);
                const currentBid = spotListing?.current_bid || 50;

                return (
                  <div
                    key={`${spot.zone}-${index}`}
                    style={{ top: spot.top, left: spot.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    {/* Hotspot Outer Button & Beacon */}
                    <button
                      type="button"
                      onClick={() => handleZoneClick(spot.zone)}
                      className={`group relative flex flex-col items-center transition-all duration-300 ${
                        isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                      }`}
                    >
                      {/* Pulsing Target Radar Ring */}
                      <span className="relative flex h-4 w-4 mb-1">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isSelected ? 'bg-volt' : 'bg-volt/40 group-hover:bg-volt'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-4 w-4 border-2 ${
                            isSelected
                              ? 'bg-volt border-white shadow-neon-volt'
                              : 'bg-black/80 border-volt group-hover:bg-volt'
                          }`}
                        />
                      </span>

                      {/* Hotspot Floating Badge */}
                      <div
                        className={`px-2 py-1 rounded-lg backdrop-blur-md border text-center font-mono shadow-xl transition-all ${
                          isSelected
                            ? 'bg-black/90 border-volt text-volt shadow-neon-volt scale-105'
                            : 'bg-black/75 border-surface-border text-white group-hover:border-volt/60 group-hover:bg-black/90'
                        }`}
                      >
                        <div className="text-[9px] font-extrabold uppercase tracking-tight whitespace-nowrap">
                          {spot.shortLabel}
                        </div>
                        <div className="text-[11px] font-black text-volt leading-none mt-0.5">
                          ${currentBid.toFixed(0)}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Bid Strip (Responsive & Clean) */}
            <div className="w-full mt-4 p-3 rounded-xl bg-surface border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
              <div className="font-mono text-xs text-center sm:text-left">
                <span className="text-slate-400">Selected Spot: </span>
                <span className="text-volt font-bold">{activeMeta.title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => handleOpenBid(activeZone, e)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-extrabold text-xs uppercase flex items-center justify-center gap-2 shadow-neon-volt transition-all transform hover:scale-105 flex-shrink-0"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>BID ${currentZoneListing ? (currentZoneListing.current_bid + 25).toFixed(0) : '75'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Selected Zone Details & Instant Bid Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-surface-card border border-surface-border space-y-5">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Active Slot Selection
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-volt/20 text-volt border border-volt/40">
                  {activeMeta.broadcastRating}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white font-mono leading-tight">{activeMeta.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{activeMeta.desc}</p>
              </div>

              {/* Pricing & Bidding Box */}
              {currentZoneListing && (
                <div className="p-4 sm:p-5 rounded-xl bg-surface border border-volt/30 space-y-4">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Current Lead</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE AUCTION
                    </span>
                  </div>

                  {/* Clean Price Header with no wrapping overlap */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-volt leading-none">
                        ${currentZoneListing.current_bid.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">USD</span>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap bg-surface-card px-2 py-0.5 rounded border border-surface-border">
                      {currentZoneListing.total_bids || 0} Bids
                    </span>
                  </div>

                  {currentZoneListing.highest_bidder_company && (
                    <div className="text-xs font-mono text-cyan-400 truncate">
                      Leading sponsor: <strong>{currentZoneListing.highest_bidder_company}</strong>
                    </div>
                  )}

                  {/* Quick Bid Increment Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border font-mono text-xs">
                    {[25, 50, 100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleOpenBid(activeZone)}
                        className="py-2.5 px-2 rounded-lg bg-surface-card hover:bg-volt hover:text-black border border-surface-border text-white text-center font-bold transition-all"
                      >
                        +${inc}
                      </button>
                    ))}
                  </div>

                  {/* Main Action Button - Clean, no truncation */}
                  <button
                    type="button"
                    onClick={() => handleOpenBid(activeZone)}
                    className="w-full py-3.5 px-4 rounded-xl bg-volt hover:bg-volt-light text-black font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-volt transition-all transform hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4 fill-black flex-shrink-0" />
                    <span>PLACE BID NOW</span>
                  </button>
                </div>
              )}

              {/* Physical Decal Specs & Visibility - Clean without truncate ellipsis */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-border/60">
                <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1 font-mono text-xs">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visibility</span>
                  </div>
                  <div className="text-white font-bold text-xs leading-tight">
                    {activeMeta.visibility.replace(' Stream Coverage', '').replace(' Camera Stream Coverage', '').replace(' Broadcast Coverage', '')}
                  </div>
                  <div className="text-[10px] text-slate-500">Camera Focus</div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1 font-mono text-xs">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-volt" />
                    <span>Dimensions</span>
                  </div>
                  <div className="text-volt font-bold text-xs leading-tight">
                    {decalSpecs.includes('4x4') ? '4x4 inches' : decalSpecs.includes('5x3') ? '5x3 inches' : decalSpecs.includes('6x4') ? '6x4 inches' : decalSpecs.includes('3x1.5') ? '3x1.5 inches' : 'Standard'}
                  </div>
                  <div className="text-[10px] text-slate-500">Sweatproof Decal</div>
                </div>
              </div>
            </div>

            {/* Preset Anatomical Zone Switcher Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Browse Body Zones:
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'shoulder_right',
                    'shoulder_left',
                    'chest',
                    'back_singlet',
                    'quad',
                    'headwear',
                  ] as PlacementZone[]
                ).map((zone) => {
                  const meta = zoneMetadata[zone];
                  const isCurrent = activeZone === zone;
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => {
                        handleZoneClick(zone);
                        if (meta.side === 'back') setView('back');
                        if (meta.side === 'front') setView('front');
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-volt text-black font-bold border-volt shadow-neon-volt'
                          : 'bg-surface-card text-slate-300 border-surface-border hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{zone.replace('_', ' ').toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Modal when user clicks "BID NOW" on any spot */}
      {modalListing && (
        <SponsorBidModal
          listing={modalListing}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultIncrement={25}
        />
      )}
    </>
  );
}
