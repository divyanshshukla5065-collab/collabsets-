
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tfdyfgvmxnzyifucaakm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZHlmZ3ZteG56eWlmdWNhYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMDk5OTMsImV4cCI6MjA4Mzg4NTk5M30.oUgD8i8RJcly-tCGmaKggGBE4Hkfc7kKHOtDX70b_zs";

// 1. Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Core Backend Logic
 */

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.name || 'User'
  };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

export const getOrCreateConversation = async (user1Id: string, user2Id: string) => {
  const [u1, u2] = [user1Id, user2Id].sort();
  
  let { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('user1_id', u1)
    .eq('user2_id', u2)
    .single();

  if (!conv) {
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({ user1_id: u1, user2_id: u2 })
      .select('id')
      .single();
    if (error) throw error;
    return newConv.id;
  }
  return conv.id;
};

export const sendMessageToSupabase = async (conversationId: string, senderId: string, receiverId: string, text: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      message: text
    });
  if (error) throw error;
  return data;
};

export const fetchMessagesFromSupabase = async (conversationId: string, limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
};

export const fetchAllProfiles = async (currentUserId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId);
  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email);
};
