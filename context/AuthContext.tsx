
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CollabRequest, ChatMessage } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase, updateProfile, getOrCreateConversation, sendMessageToSupabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  allUsers: any[];
  requests: CollabRequest[];
  messages: ChatMessage[];
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string, role: UserRole) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  completeProfile: (data: any) => Promise<void>;
  logout: () => void;
  sendRequest: (toId: string) => void;
  updateRequestStatus: (requestId: string, status: 'Accepted' | 'Rejected') => void;
  sendMessage: (otherUserId: string, text: string) => Promise<void>;
  adminVerifyUser: (userId: string) => void;
  adminDeleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<CollabRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name,
            email: session.user.email!,
            avatar: profile.avatar_url,
            role: (session.user.user_metadata.role as UserRole) || 'Influencer',
            isVerified: true,
            profileComplete: 100,
            onboardingStatus: 'COMPLETED',
            createdAt: new Date(profile.created_at).getTime()
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (name: string, email: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'dummy-password-for-demo',
        options: { data: { name, role } }
      });
      if (error) throw error;
      setUser({
        id: data.user?.id || 'pending',
        name,
        email,
        role,
        isVerified: false,
        profileComplete: 20,
        onboardingStatus: 'OTP_PENDING',
        createdAt: Date.now()
      });
    } catch (err: any) {
      throw new Error(err.message || 'Signup failed. Please check your details.');
    }
  };

  const login = async (email: string) => {
    // Admin Override - Check BEFORE hitting Supabase to avoid "Invalid Email" errors on mock accounts
    if (email === 'admin@collabset.com') {
      setUser({
        id: 'admin_001',
        name: 'System Admin',
        email: 'admin@collabset.com',
        role: 'Admin',
        isVerified: true,
        profileComplete: 100,
        onboardingStatus: 'COMPLETED',
        createdAt: Date.now()
      });
      navigate('/admin');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } catch (err: any) {
      // Provide a clearer error message for the user
      throw new Error(err.message || 'Login failed. This email might be restricted or invalid.');
    }
  };

  const verifyOtp = async (otp: string) => {
    if (otp === '123456' && user) {
      const updated = { ...user, isVerified: true, onboardingStatus: 'PROFILE_PENDING' as const };
      setUser(updated);
      return true;
    }
    return false;
  };

  const completeProfile = async (data: any) => {
    if (user && user.id !== 'pending') {
      try {
        await updateProfile(user.id, {
          avatar_url: data.avatar,
          full_name: data.brandName || user.name
        });
        const updatedUser = { 
          ...user, 
          avatar: data.avatar, 
          onboardingStatus: 'COMPLETED' as const 
        };
        setUser(updatedUser);
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to complete profile", err);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const sendRequest = (toId: string) => {
    const newReq: CollabRequest = {
      id: `req_${Date.now()}`,
      fromId: user?.id || '',
      toId,
      status: 'Pending',
      timestamp: Date.now()
    };
    setRequests([...requests, newReq]);
  };

  const updateRequestStatus = (requestId: string, status: 'Accepted' | 'Rejected') => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const sendMessage = async (otherUserId: string, text: string) => {
    if (!user) return;
    try {
      const conversationId = await getOrCreateConversation(user.id, otherUserId);
      await sendMessageToSupabase(conversationId, user.id, otherUserId, text);
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  const adminVerifyUser = (userId: string) => {};
  const adminDeleteUser = (userId: string) => {};

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, requests, messages, signup, login, verifyOtp, completeProfile, logout,
      sendRequest, updateRequestStatus, sendMessage, adminVerifyUser, adminDeleteUser
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
