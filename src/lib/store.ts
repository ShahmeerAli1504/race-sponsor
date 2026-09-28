import { create } from 'zustand';
import {
  AthleteApplication,
  AthleteProfile,
  BidItem,
  EventItem,
  ListingItem,
  MarketFilters,
} from '@/types/market';
import {
  INITIAL_APPLICATIONS,
  INITIAL_ATHLETES,
  INITIAL_BIDS,
  INITIAL_EVENTS,
  INITIAL_LISTINGS,
} from './mockData';
import { toast } from 'sonner';

interface MarketState {
  listings: ListingItem[];
  bids: Record<string, BidItem[]>;
  applications: AthleteApplication[];
  athletes: AthleteProfile[];
  events: EventItem[];
  filters: MarketFilters;

  // Filter actions
  setFilters: (filters: Partial<MarketFilters>) => void;
  resetFilters: () => void;

  // Bidding & Anti-Sniping engine
  placeBid: (bidData: {
    listing_id: string;
    bidder_name: string;
    bidder_company: string;
    bidder_email: string;
    bidder_phone: string;
    amount: number;
  }) => { success: boolean; antiSniped: boolean; message: string };

  // Application actions
  submitApplication: (
    data: Omit<AthleteApplication, 'id' | 'status' | 'fee_paid' | 'created_at'>
  ) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string) => void;

  // Admin Listing Studio
  createListing: (newListing: Omit<ListingItem, 'id' | 'created_at' | 'current_bid'>) => void;
  updateListing: (id: string, updates: Partial<ListingItem>) => void;
  invalidateBid: (listingId: string, bidId: string) => void;
}

const DEFAULT_FILTERS: MarketFilters = {
  search: '',
  sport: 'All',
  placement: 'All',
  minBid: 0,
  maxBid: 5000,
  status: 'All',
  sortBy: 'ending_soonest',
};

export const useMarketStore = create<MarketState>((set, get) => ({
  listings: INITIAL_LISTINGS,
  bids: INITIAL_BIDS,
  applications: INITIAL_APPLICATIONS,
  athletes: INITIAL_ATHLETES,
  events: INITIAL_EVENTS,
  filters: DEFAULT_FILTERS,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  placeBid: ({ listing_id, bidder_name, bidder_company, bidder_email, bidder_phone, amount }) => {
    const state = get();
    const listingIndex = state.listings.findIndex((l) => l.id === listing_id);
    if (listingIndex === -1) {
      return { success: false, antiSniped: false, message: 'Listing not found' };
    }

    const listing = state.listings[listingIndex];
    if (amount <= listing.current_bid) {
      return {
        success: false,
        antiSniped: false,
        message: `Bid must be strictly higher than current lead of $${listing.current_bid.toFixed(2)}`,
      };
    }

    const now = new Date();
    const bidsCloseAt = new Date(listing.bids_close_at);
    const msRemaining = bidsCloseAt.getTime() - now.getTime();

    if (msRemaining <= 0) {
      return {
        success: false,
        antiSniped: false,
        message: 'This live auction has already closed.',
      };
    }

    let isAntiSniped = false;
    let newCloseAt = listing.bids_close_at;
    let extensionCount = listing.auto_extended_count || 0;

    // ANTI-SNIPING ENGINE MECHANIC:
    // If bid is submitted within 60 seconds of bids_close_at, extend cutoff by +60 seconds
    if (msRemaining < 60 * 1000) {
      isAntiSniped = true;
      extensionCount += 1;
      const extendedDate = new Date(bidsCloseAt.getTime() + 60 * 1000);
      newCloseAt = extendedDate.toISOString();
    }

    const newBid: BidItem = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      listing_id,
      bidder_name,
      bidder_company,
      bidder_email,
      bidder_phone,
      amount,
      created_at: now.toISOString(),
      is_anti_sniped: isAntiSniped,
    };

    const existingBids = state.bids[listing_id] || [];
    const updatedBidsForListing = [newBid, ...existingBids];

    const updatedListings = [...state.listings];
    updatedListings[listingIndex] = {
      ...listing,
      current_bid: amount,
      bids_close_at: newCloseAt,
      highest_bidder_company: bidder_company,
      total_bids: (listing.total_bids || 0) + 1,
      auto_extended_count: extensionCount,
    };

    set({
      listings: updatedListings,
      bids: {
        ...state.bids,
        [listing_id]: updatedBidsForListing,
      },
    });

    if (isAntiSniped) {
      toast.warning('⚡ ANTI-SNIPING TRIGGERED!', {
        description: `Bid submitted under 60s! Auction timer extended by +60 SECONDS.`,
        duration: 6000,
      });
    } else {
      toast.success('🎯 NEW LEADING BID PLACED!', {
        description: `$${amount.toFixed(2)} placed by ${bidder_company}.`,
      });
    }

    return {
      success: true,
      antiSniped: isAntiSniped,
      message: isAntiSniped
        ? 'Bid placed! Anti-sniping extended timer by 60 seconds.'
        : 'Bid placed successfully!',
    };
  },

  submitApplication: (data) => {
    const newApp: AthleteApplication = {
      ...data,
      id: `app-${Date.now()}`,
      fee_paid: false,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      applications: [newApp, ...state.applications],
    }));

    toast.success('Application Received!', {
      description: 'Our admin team will review your details within 24 hours.',
    });
  },

  approveApplication: (id) => {
    const state = get();
    const app = state.applications.find((a) => a.id === id);
    if (!app) return;

    // 1. Update application status
    const updatedApps = state.applications.map((a) =>
      a.id === id ? { ...a, status: 'APPROVED' as const, fee_paid: true } : a
    );

    // 2. Create athlete profile if needed
    const athleteId = `ath-${Date.now()}`;
    const newAthlete: AthleteProfile = {
      id: athleteId,
      name: app.full_name,
      avatar_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
      bio: app.athletic_bio || `Elite ${app.sport} competitor`,
      hometown: 'United States',
      home_gym: app.gym_affiliation || 'Independent Performance',
      created_at: new Date().toISOString(),
    };

    // 3. Create Event or link existing
    const eventId = `evt-${Date.now()}`;
    const raceDate = new Date(app.race_date);
    const newEvent: EventItem = {
      id: eventId,
      title: app.target_event,
      sport: app.sport,
      location: 'Official Championship Arena',
      race_date: raceDate.toISOString(),
      created_at: new Date().toISOString(),
    };

    // Calculate 2-week pre-race cutoff date (14 days before race date)
    const cutoffDate = new Date(raceDate.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 4. Create new listing
    const newListing: ListingItem = {
      id: `lst-${Date.now()}`,
      athlete_id: athleteId,
      athlete: newAthlete,
      event_id: eventId,
      event: newEvent,
      title: `${app.full_name} - ${app.target_event} ${app.requested_placement.replace('_', ' ').toUpperCase()} Decal`,
      placement_zone: app.requested_placement,
      decal_specs: '4x4 inches High-Adhesion Sweatproof Decal',
      social_deliverables: { stories: 3, feed_posts: 1, reels: 1 },
      starting_bid: 50.00,
      current_bid: 50.00,
      bids_close_at: cutoffDate.toISOString(),
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      total_bids: 0,
      auto_extended_count: 0,
    };

    set({
      applications: updatedApps,
      athletes: [newAthlete, ...state.athletes],
      events: [newEvent, ...state.events],
      listings: [newListing, ...state.listings],
    });

    toast.success('Fee Verified & Application Approved!', {
      description: `Listing activated for ${app.full_name}. Bidding closes 14 days prior to race day.`,
    });
  },

  rejectApplication: (id) => {
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status: 'REJECTED' as const } : a
      ),
    }));

    toast.info('Application Marked as Rejected');
  },

  createListing: (newListingData) => {
    const newListing: ListingItem = {
      ...newListingData,
      id: `lst-${Date.now()}`,
      current_bid: newListingData.starting_bid,
      created_at: new Date().toISOString(),
      total_bids: 0,
      auto_extended_count: 0,
    };

    set((state) => ({
      listings: [newListing, ...state.listings],
    }));

    toast.success('New Auction Listing Published!');
  },

  updateListing: (id, updates) => {
    set((state) => ({
      listings: state.listings.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));

    toast.success('Listing Updated');
  },


  invalidateBid: (listingId, bidId) => {
    set((state) => {
      const listingBids = (state.bids[listingId] || []).filter((b) => b.id !== bidId);
      const newHighestBid = listingBids[0];
      const listing = state.listings.find((l) => l.id === listingId);

      const updatedListings = state.listings.map((l) => {
        if (l.id === listingId) {
          return {
            ...l,
            current_bid: newHighestBid ? newHighestBid.amount : l.starting_bid,
            highest_bidder_company: newHighestBid ? newHighestBid.bidder_company : undefined,
            total_bids: Math.max(0, (l.total_bids || 1) - 1),
          };
        }
        return l;
      });

      return {
        bids: { ...state.bids, [listingId]: listingBids },
        listings: updatedListings,
      };
    });

    toast.warning('Bid Invalidated by Admin');
  },
}));
