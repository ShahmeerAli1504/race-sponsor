'use client';

import { useMarketStore } from '@/lib/store';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BodyPlacementMockup } from '@/components/market/BodyPlacementMockup';
import { BiddingTerminal } from '@/components/market/BiddingTerminal';
import {
  Award,
  MapPin,
  Building2,
  Instagram,
  Activity,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Share2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AthleteDetailPage() {
  const params = useParams();
  const idParam = params?.id as string;

  const { listings } = useMarketStore();

  // Find listing by ID or athlete_id
  const listing = listings.find((l) => l.id === idParam || l.athlete_id === idParam);

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono space-y-4">
        <Zap className="w-12 h-12 text-volt mx-auto" />
        <h2 className="text-2xl font-bold text-white">Listing Not Found</h2>
        <p className="text-xs text-slate-400">The requested athlete sponsorship auction does not exist or was archived.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-volt text-black font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const { athlete, event, social_deliverables } = listing;

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied to Clipboard!');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Breadcrumb & Share Navigation */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-400">
        <Link href="/" className="flex items-center gap-2 hover:text-volt transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Auctions</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-surface border border-surface-border text-[10px] font-bold text-volt">
            {event.sport} DISCIPLINE
          </span>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-surface border border-surface-border hover:border-slate-400 text-slate-300 hover:text-white transition-colors"
            title="Share Auction"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Scroll Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Free-scrolling Athlete Portfolio & Placement Specs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Athlete Hero Cover & Profile Header */}
          <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden p-6 space-y-6 shadow-xl">
            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-surface-card border border-surface-border">
              {athlete.cover_image_url ? (
                <Image
                  src={athlete.cover_image_url}
                  alt={athlete.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-surface-highlight to-surface" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

              {/* Event Badge */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-surface-border text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg">
                <Award className="w-4 h-4 text-volt" />
                <span>{event.title}</span>
              </div>
            </div>

            {/* Athlete Profile Info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 relative z-10 px-2">
              <div className="flex items-end gap-4">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-volt shadow-neon-volt flex-shrink-0 bg-surface">
                  <Image src={athlete.avatar_url} alt={athlete.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{athlete.name}</h1>
                    {(athlete.id === 'a1111111-1111-1111-1111-111111111111' || athlete.name === 'Jaffet Corona') && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-volt text-black text-[11px] font-mono font-extrabold shadow-neon-volt">
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>FOUNDER & PLATFORM OWNER</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono mt-1">
                    <span className="flex items-center gap-1 text-volt">
                      <MapPin className="w-3.5 h-3.5" />
                      {athlete.hometown}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-semibold">{athlete.home_gym}</span>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="flex items-center gap-2 font-mono text-xs">
                {athlete.instagram_url && (
                  <a
                    href={athlete.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-volt text-slate-300 hover:text-volt transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {athlete.strava_url && (
                  <a
                    href={athlete.strava_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-race-orange text-slate-300 hover:text-race-orange transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Business Affiliation Banner (e.g., The Compound Coffee) */}
            {athlete.business_affiliations && (
              <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border flex items-center gap-3 text-xs font-mono">
                <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400">Business Ventures & Affiliations:</span>
                  <span className="text-white font-bold ml-1.5">{athlete.business_affiliations}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Anatomical Body Placement Silhouette Mockup */}
          <BodyPlacementMockup
            selectedZone={listing.placement_zone}
            decalSpecs={listing.decal_specs}
          />

          {/* Athlete Story & Background */}
          <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-volt" />
              <span>Athletic Background & Target Race Goals</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">{athlete.bio}</p>
          </div>

          {/* Decal Specs & Bundled Social Deliverables Checklist */}
          <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-6 shadow-xl font-mono">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Sponsorship Deliverables & Vector Decal Specs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Decal Specifications</div>
                <div className="text-white font-bold text-sm">{listing.decal_specs}</div>
                <p className="text-[11px] text-slate-400 font-sans leading-normal">
                  Printed on medical-grade, sweatproof, water-resistant temporary tattoo film. Withstands intense exertion & friction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Bundled Social Deliverables</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-volt" />
                    <span>{social_deliverables.stories} Dedicated Instagram Stories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-race-orange" />
                    <span>{social_deliverables.feed_posts} High-Resolution Feed Post</span>
                  </li>
                  {social_deliverables.reels && (
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{social_deliverables.reels} Event Highlight Reel</span>
                    </li>
                  )}
                  {social_deliverables.tag_in_bio && (
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Sponsor Tag in Instagram Bio</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Bidding Terminal */}
        <div className="lg:col-span-5">
          <BiddingTerminal listing={listing} />
        </div>
      </div>
    </div>
  );
}
