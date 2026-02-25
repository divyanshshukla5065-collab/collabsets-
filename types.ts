export type UserRole = 'Influencer' | 'Brand' | 'Admin' | 'Team' | null;

export type DeliverableType = 'Reel' | 'Post' | 'Story';

export type CampaignStatus = 'Live' | 'Active' | 'Blocked' | 'Completed';

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  type: 'Paid' | 'Barter';
  deliverables: DeliverableType[];
  creatorCount: number;
  minFollowers: number;
  budget: number;
  niche: string;
  description: string;
  targetAge: string;
  targetGender: string;
  status: CampaignStatus;
  timestamp: number;
  declinedBy?: string[]; // Array of influencer IDs who declined
  acceptedBy?: string[]; // Array of influencer IDs who accepted
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  profileComplete: number; 
  onboardingStatus: 'OTP_PENDING' | 'PROFILE_PENDING' | 'COMPLETED';
  createdAt: number;
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
  totalClaimed?: number;
  amountDue?: number;
}

export type ProjectStatus = 'DEAL_SIGNED' | 'SHOOTING' | 'EDITING' | 'UPLOADING' | 'COMPLETED';
export type PaymentStatus = 'AWAITING_BRAND' | 'HELD_IN_ESCROW' | 'RELEASED';

export interface Deal {
  id: string;
  campaignId?: string; // Link to specific campaign
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
  campaignId?: string;
}

export interface ChatMessage {
  id: string;
  collabId: string;
  senderId: string;
  text: string;
  timestamp: number;
  seen: boolean;
}