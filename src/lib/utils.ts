import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlacementZone } from '@/types/market';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
}

export function formatPlacementZone(zone: PlacementZone): string {
  switch (zone) {
    case 'shoulder_right':
      return 'Right Deltoid Slot';
    case 'shoulder_left':
      return 'Left Deltoid Slot';
    case 'chest':
      return 'Center Chest Slot';
    case 'back_singlet':
      return 'Back Aero Singlet Slot';
    case 'quad':
      return 'Quad / Fight Trunks Slot';
    case 'headwear':
      return 'Headband / Helmet Slot';
    case 'social_only':
      return 'Social Shoutouts Only';
    default:
      return String(zone).replace('_', ' ').toUpperCase();
  }
}
