
export type UserRole = 'Influencer' | 'Brand' | 'Admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  profileComplete: number; // 0-100
  onboardingStatus: 'OTP_PENDING' | 'PROFILE_PENDING' | 'COMPLETED';
  createdAt: number;
  // Profile fields
  category?: string;
  city?: string;
  brandName?: string;
  isBlocked?: boolean;
  pricePerPost?: number;
  avgCampaignBudget?: number;
  instagramHandle?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  website?: string;
  bio?: string;
  followers?: number;
  avgViews?: number;
  gender?: string;
  age?: number;
  isBarterEnabled?: boolean;
  // Financial metrics (Private)
  totalClaimed?: number;
  amountDue?: number;
}

export type ProjectStatus = 'DEAL_SIGNED' | 'SHOOTING' | 'EDITING' | 'UPLOADING' | 'COMPLETED';
export type PaymentStatus = 'AWAITING_BRAND' | 'HELD_IN_ESCROW' | 'RELEASED';

export interface Deal {
  id: string;
  influencerId: string;
  brandId: string;
  brandName: string;
  influencerName: string;
  amount: number;
  projectStatus: ProjectStatus;
  paymentStatus: PaymentStatus;
  workLink?: string;
  timestamp: number;
  lastUpdated: number;
}

export interface CollabRequest {
  id: string;
  fromId: string;
  toId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  timestamp: number;
  initialMessage?: string;
}

export interface ChatMessage {
  id: string;
  collabId: string;
  senderId: string;
  text: string;
  timestamp: number;
  seen: boolean;
}
