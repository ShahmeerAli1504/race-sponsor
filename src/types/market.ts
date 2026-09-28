export type SportCategory = 'HYROX' | 'CrossFit' | 'Marathon' | 'Triathlon' | 'Combat';

export type PlacementZone =
  | 'chest'
  | 'shoulder_left'
  | 'shoulder_right'
  | 'back_singlet'
  | 'quad'
  | 'headwear'
  | 'social_only';

export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SocialDeliverables {
  stories: number;
  feed_posts: number;
  reels?: number;
  tag_in_bio?: boolean;
}

export interface AthleteApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sport: SportCategory;
  target_event: string;
  race_date: string;
  gym_affiliation?: string;
  instagram_handle?: string;
  athletic_bio?: string;
  requested_placement: PlacementZone;
  fee_paid: boolean;
  status: ApplicationStatus;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  sport: SportCategory;
  location: string;
  race_date: string;
  created_at: string;
}

export interface AthleteProfile {
  id: string;
  name: string;
  avatar_url: string;
  cover_image_url?: string;
  bio: string;
  hometown: string;
  home_gym: string;
  business_affiliations?: string;
  instagram_url?: string;
  strava_url?: string;
  created_at: string;
}

export interface BidItem {
  id: string;
  listing_id: string;
  bidder_name: string;
  bidder_company: string;
  bidder_email: string;
  bidder_phone: string;
  amount: number;
  created_at: string;
  is_anti_sniped?: boolean;
}

export interface ListingItem {
  id: string;
  athlete_id: string;
  athlete: AthleteProfile;
  event_id: string;
  event: EventItem;
  title: string;
  placement_zone: PlacementZone;
  decal_specs: string;
  social_deliverables: SocialDeliverables;
  starting_bid: number;
  current_bid: number;
  bids_close_at: string; // ISO String, 14 days prior to event.race_date
  status: ListingStatus;
  created_at: string;
  total_bids?: number;
  highest_bidder_company?: string;
  auto_extended_count?: number;
}

export interface MarketFilters {
  search: string;
  sport: SportCategory | 'All';
  placement: PlacementZone | 'All';
  minBid: number;
  maxBid: number;
  status: ListingStatus | 'All';
  sortBy: 'ending_soonest' | 'highest_bid' | 'lowest_starting_bid' | 'most_bids' | 'newest';
}
