
import { supabase } from "@/integrations/supabase/client";

export interface AdminAction {
  id: string;
  admin_user_id: string;
  action_type: 'token_gift' | 'user_search' | 'role_assignment';
  target_identifier?: string;
  target_user_id?: string;
  details: Record<string, any>;
  created_at: string;
}

/**
 * Search users by email or username
 */
export const searchUsers = async (query: string): Promise<any[]> => {
  try {
    // First try to find by email in auth metadata
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    const matchingAuthUser = authUsers.users.find(u => 
      u.email?.toLowerCase().includes(query.toLowerCase()) ||
      u.phone?.includes(query)
    );
    
    if (matchingAuthUser) {
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', matchingAuthUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      return [{
        ...profile,
        email: matchingAuthUser.email,
        phone: matchingAuthUser.phone
      }];
    }
    
    // Fallback: search profiles by username
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return profiles || [];
  } catch (error) {
    console.error('Search users error:', error);
    return [];
  }
};

/**
 * Gift tokens to a user
 */
export const giftTokens = async (
  adminUserId: string,
  targetUserId: string,
  amount: number,
  message: string = ''
): Promise<void> => {
  // First ensure user has a token wallet
  const { error: walletError } = await supabase
    .from('token_wallets')
    .upsert({ 
      user_id: targetUserId, 
      balance: 0 
    }, { 
      onConflict: 'user_id',
      ignoreDuplicates: true 
    });
  
  if (walletError) throw walletError;
  
  // Add tokens to user's wallet
  const { error: updateError } = await supabase.rpc('spend_token', {
    p_user_id: targetUserId,
    p_amount: -amount, // Negative to add tokens
    p_description: 'Admin gift',
    p_transaction_type: 'gift'
  });
  
  if (updateError) throw updateError;
  
  // Log admin action
  const { error: logError } = await supabase
    .from('admin_actions')
    .insert({
      admin_user_id: adminUserId,
      action_type: 'token_gift',
      target_user_id: targetUserId,
      details: {
        amount,
        message,
        timestamp: new Date().toISOString()
      }
    });
  
  if (logError) throw logError;
};

/**
 * Get user's token balance
 */
export const getUserTokenBalance = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('token_wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data?.balance || 0;
};

/**
 * Get admin actions log
 */
export const getAdminActions = async (): Promise<AdminAction[]> => {
  const { data, error } = await supabase
    .from('admin_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data || [];
};
