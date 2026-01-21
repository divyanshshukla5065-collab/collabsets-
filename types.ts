
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
}

export interface InfluencerProfile {
  instagramHandle: string;
  followers: number;
  avgViews: number;
  category: string;
  city: string;
  gender: string;
  age: number;
  pricePerPost: number; // INR
  linkedinUrl?: string;
  bio: string;
}

export interface BrandProfile {
  brandName: string;
  category: string;
  city: string;
  website?: string;
  avgCampaignBudget: number; // INR
  logo?: string;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface CollabRequest {
  id: string;
  fromId: string;
  toId: string;
  status: RequestStatus;
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
