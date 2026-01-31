
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Deal, ProjectStatus, PaymentStatus } from '../types';
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

interface AuthContextType {
  user: any | null; 
  allUsers: User[];
  requests: any[];
  blogs: any[];
  deals: Deal[];
  loading: boolean;
  isAriaOpen: boolean;
  setIsAriaOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  completeProfile: (data: any) => Promise<void>;
  toggleBarterStatus: (enabled: boolean) => Promise<void>;
  checkVerification: () => Promise<boolean>;
  adminVerifyUser: (uid: string) => Promise<void>;
  adminBlockUser: (uid: string, blocked: boolean) => Promise<void>;
  adminDeleteUser: (uid: string) => Promise<void>;
  saveBlogPost: (blog: any) => Promise<void>;
  deleteBlogPost: (blogId: string) => Promise<void>;
  sendCollabRequest: (toId: string, initialMessage?: string) => Promise<void>;
  acceptCollabRequest: (requestId: string) => Promise<void>;
  rejectCollabRequest: (requestId: string) => Promise<void>;
  createDirectChat: (toId: string) => Promise<void>;
  updateDealStatus: (dealId: string, status: ProjectStatus, workLink?: string) => Promise<void>;
  updatePaymentStatus: (dealId: string, status: PaymentStatus) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAriaOpen, setIsAriaOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);

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
      setBlogs(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })).sort((a, b) => b.timestamp - a.timestamp) : []);
    });

    onValue(ref(db, 'deals'), (snapshot) => {
      const data = snapshot.val();
      setDeals(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await reload(firebaseUser);
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const dbData = snapshot.val();
          setUser({ id: firebaseUser.uid, email: firebaseUser.email!, ...dbData });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    const initialData = { name, role, createdAt: Date.now(), onboardingStatus: 'PROFILE_PENDING', isVerified: false, isBlocked: false, totalClaimed: 0, amountDue: 0, isBarterEnabled: false };
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
      const initialData = { name: result.user.displayName, role, createdAt: Date.now(), onboardingStatus: 'PROFILE_PENDING', isVerified: true, totalClaimed: 0, amountDue: 0, isBarterEnabled: false };
      await set(userRef, initialData);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const updateDealStatus = async (dealId: string, status: ProjectStatus, workLink?: string) => {
    const updates: any = { projectStatus: status, lastUpdated: Date.now() };
    if (workLink) updates.workLink = workLink;
    await update(ref(db, `deals/${dealId}`), updates);
  };

  const updatePaymentStatus = async (dealId: string, status: PaymentStatus) => {
    await update(ref(db, `deals/${dealId}`), { paymentStatus: status, lastUpdated: Date.now() });
  };

  const acceptCollabRequest = async (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;
    await update(ref(db, `requests/${requestId}`), { status: 'Accepted' });
    
    // Auto-create a Deal entry
    const influencerId = req.fromId;
    const brandId = req.toId;
    const brand = allUsers.find(u => u.id === brandId);
    const influencer = allUsers.find(u => u.id === influencerId);

    const dealRef = push(ref(db, 'deals'));
    await set(dealRef, {
      id: dealRef.key,
      influencerId,
      brandId,
      brandName: brand?.brandName || brand?.name || 'Brand',
      influencerName: influencer?.name || 'Influencer',
      amount: influencer?.pricePerPost || 0,
      projectStatus: 'DEAL_SIGNED',
      paymentStatus: 'AWAITING_BRAND',
      timestamp: Date.now(),
      lastUpdated: Date.now()
    });
  };

  const completeProfile = async (data: any) => {
    if (!user) return;
    await update(ref(db, `users/${user.id}`), { ...data, onboardingStatus: 'COMPLETED' });
  };

  const toggleBarterStatus = async (enabled: boolean) => {
    if (!user) return;
    await update(ref(db, `users/${user.id}`), { isBarterEnabled: enabled });
    setUser((prev: any) => ({ ...prev, isBarterEnabled: enabled }));
  };

  const sendCollabRequest = async (toId: string, initialMessage?: string) => {
    if (!user) return;
    const newRequestRef = push(ref(db, 'requests'));
    await set(newRequestRef, {
      fromId: user.id,
      toId: toId,
      status: 'Pending',
      timestamp: Date.now(),
      initialMessage: initialMessage || "Interested in collaborating!"
    });
  };

  // Remaining administrative and helper stubs to keep standard
  const adminLogin = async () => {};
  const sendPasswordReset = async (email: string) => await sendPasswordResetEmail(auth, email);
  const resendVerificationEmail = async () => {};
  const checkVerification = async () => true;
  const adminVerifyUser = async () => {};
  const adminBlockUser = async () => {};
  const adminDeleteUser = async () => {};
  const saveBlogPost = async () => {};
  const deleteBlogPost = async () => {};
  const rejectCollabRequest = async (id: string) => await update(ref(db, `requests/${id}`), { status: 'Rejected' });
  const createDirectChat = async (toId: string) => {
    const existing = requests.find(r => (r.fromId === user?.id && r.toId === toId) || (r.fromId === toId && r.toId === user?.id));
    if (!existing) await sendCollabRequest(toId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, requests, blogs, deals, loading, isAriaOpen, setIsAriaOpen, login, adminLogin, signup, loginWithGoogle, logout, sendPasswordReset, resendVerificationEmail, completeProfile, toggleBarterStatus, checkVerification, adminVerifyUser, adminBlockUser, adminDeleteUser,
      saveBlogPost, deleteBlogPost, sendCollabRequest, acceptCollabRequest, rejectCollabRequest, createDirectChat, updateDealStatus, updatePaymentStatus
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
