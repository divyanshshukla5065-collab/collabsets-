import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Deal, ProjectStatus, PaymentStatus, Campaign, CampaignStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser,
  reload,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { ref, get, set, update, onValue, remove, push } from 'firebase/database';

interface TeamSettings {
  password: string;
  allowedEmails: string[];
}

interface AuthContextType {
  user: any | null; 
  allUsers: User[];
  requests: any[];
  blogs: any[];
  deals: Deal[];
  campaigns: Campaign[];
  teamSettings: TeamSettings | null;
  loading: boolean;
  isAriaOpen: boolean;
  setIsAriaOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  completeProfile: (data: any) => Promise<void>;
  adminVerifyUser: (uid: string) => Promise<void>;
  adminBlockUser: (uid: string, blocked: boolean) => Promise<void>;
  adminDeleteUser: (uid: string) => Promise<void>;
  adminUpdateTeamSettings: (updates: Partial<TeamSettings>) => Promise<void>;
  adminToggleTeamAccess: (uid: string, hasAccess: boolean) => Promise<void>;
  saveBlogPost: (blog: any) => Promise<void>;
  deleteBlogPost: (blogId: string) => Promise<void>;
  sendCollabRequest: (toId: string, initialMessage?: string) => Promise<void>;
  acceptCollabRequest: (requestId: string) => Promise<void>;
  rejectCollabRequest: (requestId: string) => Promise<void>;
  createDirectChat: (toId: string) => Promise<void>;
  updateDealStatus: (dealId: string, status: ProjectStatus, workLink?: string) => Promise<void>;
  updatePaymentStatus: (dealId: string, status: PaymentStatus) => Promise<void>;
  createCampaign: (campaign: Partial<Campaign>) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  acceptCampaign: (campaignId: string) => Promise<void>;
  declineCampaign: (campaignId: string) => Promise<void>;
  adminSetCampaignStatus: (campaignId: string, status: CampaignStatus) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [teamSettings, setTeamSettings] = useState<TeamSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAriaOpen, setIsAriaOpen] = useState(false);
  const navigate = useNavigate();

  // Heartbeat system to update DAU
  const updateActivity = async (uid: string) => {
    await update(ref(db, `users/${uid}`), { lastActive: Date.now() });
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const teamData = localStorage.getItem('team_session');
    if (teamData) setUser(JSON.parse(teamData));

    // Listen for Team Settings
    onValue(ref(db, 'settings/team_portal'), (snapshot) => {
      setTeamSettings(snapshot.val());
    });

    onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      setAllUsers(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
    });

    onValue(ref(db, 'requests'), (snapshot) => {
      const data = snapshot.val();
      setRequests(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
    });

    onValue(ref(db, 'blogs'), (snapshot) => {
      const data = snapshot.val();
      setBlogs(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) : []);
    });

    onValue(ref(db, 'deals'), (snapshot) => {
      const data = snapshot.val();
      setDeals(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
    });

    onValue(ref(db, 'campaigns'), (snapshot) => {
      const data = snapshot.val();
      setCampaigns(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })).sort((a, b) => b.timestamp - a.timestamp) : []);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await reload(firebaseUser);
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const dbData = snapshot.val();
          const userData = { id: firebaseUser.uid, email: firebaseUser.email!, ...dbData };
          setUser(userData);
          updateActivity(firebaseUser.uid);
        }
      } else {
        if (!localStorage.getItem('team_session')) setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    const initialData = { name, role, createdAt: Date.now(), lastActive: Date.now(), onboardingStatus: 'PROFILE_PENDING', isVerified: false, isBlocked: false, totalClaimed: 0, amountDue: 0, isBarterEnabled: false, hasTeamAccess: false };
    await set(ref(db, `users/${userCredential.user.uid}`), initialData);
    setUser({ id: userCredential.user.uid, email, ...initialData });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userRef = ref(db, `users/${result.user.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      const initialData = { name: result.user.displayName, role, createdAt: Date.now(), lastActive: Date.now(), onboardingStatus: 'PROFILE_PENDING', isVerified: true, totalClaimed: 0, amountDue: 0, isBarterEnabled: false, hasTeamAccess: false };
      await set(userRef, initialData);
    } else {
      updateActivity(result.user.uid);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    // 1. Dynamic Team Portal Logic
    if (teamSettings && password === teamSettings.password) {
      // Find user by email
      const targetUser = allUsers.find(u => u.email === email);
      
      // Strict Restriction: Umaima/Team members must be specifically allowed by Admin
      if (!targetUser || !targetUser.hasTeamAccess) {
        throw new Error("Access Denied: You do not have Team Portal permissions.");
      }

      const teamUser = {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: 'Team',
        onboardingStatus: 'COMPLETED',
        isVerified: true,
        createdAt: targetUser.createdAt
      };
      
      setUser(teamUser);
      localStorage.setItem('team_session', JSON.stringify(teamUser));
      return;
    }

    // 2. Main Admin Firebase Login
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('team_session');
    setUser(null);
    navigate('/');
  };

  const adminUpdateTeamSettings = async (updates: Partial<TeamSettings>) => {
    await update(ref(db, 'settings/team_portal'), updates);
  };

  const adminToggleTeamAccess = async (uid: string, hasAccess: boolean) => {
    await update(ref(db, `users/${uid}`), { hasTeamAccess: hasAccess });
  };

  const createCampaign = async (campaign: Partial<Campaign>) => {
    if (!user || user.role !== 'Brand') return;
    const campaignRef = push(ref(db, 'campaigns'));
    const campaignData = { ...campaign, id: campaignRef.key, brandId: user.id, brandName: user.brandName || user.name, status: 'Live', timestamp: Date.now() };
    await set(campaignRef, campaignData);
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    await update(ref(db, `campaigns/${campaignId}`), updates);
  };

  const adminSetCampaignStatus = async (campaignId: string, status: CampaignStatus) => {
    await update(ref(db, `campaigns/${campaignId}`), { status });
  };

  const acceptCampaign = async (campaignId: string) => {
    if (!user || user.role !== 'Influencer') return;
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    const accepts = campaign.acceptedBy || [];
    await update(ref(db, `campaigns/${campaignId}`), { acceptedBy: [...accepts, user.id] });
    const reqRef = push(ref(db, 'requests'));
    await set(reqRef, { id: reqRef.key, fromId: user.id, toId: campaign.brandId, status: 'Accepted', timestamp: Date.now(), campaignId: campaign.id, initialMessage: `Accepted: ${campaign.name}` });
    const dealRef = push(ref(db, 'deals'));
    await set(dealRef, { id: dealRef.key, campaignId: campaign.id, influencerId: user.id, brandId: campaign.brandId, brandName: campaign.brandName, influencerName: user.name, amount: campaign.budget, projectStatus: 'DEAL_SIGNED', paymentStatus: 'AWAITING_BRAND', timestamp: Date.now(), lastUpdated: Date.now() });
  };

  const updateDealStatus = async (dealId: string, status: ProjectStatus, workLink?: string) => {
    const updates: any = { projectStatus: status, lastUpdated: Date.now() };
    if (workLink) updates.workLink = workLink;
    await update(ref(db, `deals/${dealId}`), updates);
  };

  const updatePaymentStatus = async (dealId: string, status: PaymentStatus) => {
    await update(ref(db, `deals/${dealId}`), { paymentStatus: status, lastUpdated: Date.now() });
  };

  const deleteCampaign = async (campaignId: string) => {
    await remove(ref(db, `campaigns/${campaignId}`));
  };

  const completeProfile = async (data: any) => {
    if (!user) return;
    await update(ref(db, `users/${user.id}`), { ...data, onboardingStatus: 'COMPLETED' });
  };

  const adminVerifyUser = async (uid: string) => await update(ref(db, `users/${uid}`), { isVerified: true });
  const adminBlockUser = async (uid: string, blocked: boolean) => await update(ref(db, `users/${uid}`), { isBlocked: blocked });
  const adminDeleteUser = async (uid: string) => await remove(ref(db, `users/${uid}`));
  const saveBlogPost = async (blog: any) => {
    const blogId = blog.id || push(ref(db, 'blogs')).key;
    const blogData = { ...blog, id: blogId, author: user?.name || 'Aria', timestamp: Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    await set(ref(db, `blogs/${blogId}`), blogData);
  };
  const deleteBlogPost = async (blogId: string) => await remove(ref(db, `blogs/${blogId}`));
  const sendCollabRequest = async (toId: string, initialMessage?: string) => {
    if (!user) return;
    const newRequestRef = push(ref(db, 'requests'));
    await set(newRequestRef, { fromId: user.id, toId: toId, status: 'Pending', timestamp: Date.now(), initialMessage: initialMessage || "Interested!" });
  };
  const acceptCollabRequest = async (id: string) => await update(ref(db, `requests/${id}`), { status: 'Accepted' });
  const rejectCollabRequest = async (id: string) => await update(ref(db, `requests/${id}`), { status: 'Rejected' });
  const createDirectChat = async (toId: string) => {
    const existing = requests.find(r => (r.fromId === user?.id && r.toId === toId) || (r.fromId === toId && r.toId === user?.id));
    if (!existing) await sendCollabRequest(toId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, requests, blogs, deals, campaigns, teamSettings, loading, isAriaOpen, setIsAriaOpen, login, adminLogin, signup, loginWithGoogle, logout, sendPasswordReset: (email: string) => sendPasswordResetEmail(auth, email), completeProfile, adminVerifyUser, adminBlockUser, adminDeleteUser, adminUpdateTeamSettings, adminToggleTeamAccess,
      saveBlogPost, deleteBlogPost, sendCollabRequest, acceptCollabRequest, rejectCollabRequest, createDirectChat, updateDealStatus, updatePaymentStatus, createCampaign, updateCampaign, deleteCampaign, acceptCampaign, declineCampaign: async (id: string) => {}, adminSetCampaignStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};