
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserSearchResult {
  id: string;
  username: string | null;
  avatar_url: string | null;
  tokens: number;
  role: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
  tokens: number;
  role: string | null;
  created_at: string;
}

export interface AdminAction {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_identifier: string | null;
  target_user_id: string | null;
  details: Record<string, any>;
  created_at: string;
}

/**
 * Searches for users by email or phone number
 */
export const searchUsersByIdentifier = async (identifier: string): Promise<UserSearchResult[]> => {
  try {
    console.log("Searching for users with identifier:", identifier);
    
    // First, get profiles that match the username
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${identifier}%`);

    if (profileError) {
      console.error("Error searching profiles:", profileError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles found matching identifier");
      return [];
    }

    // For each profile, get additional data
    const userResults: UserSearchResult[] = [];
    
    for (const profile of profiles) {
      // Get token balance
      const { data: wallet } = await supabase
        .from('token_wallets')
        .select('balance')
        .eq('user_id', profile.id)
        .single();

      // Get user role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.id)
        .single();

      userResults.push({
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        tokens: wallet?.balance || 0,
        role: userRole?.role || null,
        created_at: profile.created_at,
      });
    }

    return userResults;
  } catch (error: any) {
    console.error("Error in searchUsersByIdentifier:", error);
    toast.error("Failed to search users");
    return [];
  }
};

// Legacy function name for backwards compatibility
export const searchUsers = searchUsersByIdentifier;

/**
 * Gets detailed user information by user ID
 */
export const getUserDetails = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return null;
    }

    return profile;
  } catch (error: any) {
    console.error("Error getting user details:", error);
    return null;
  }
};

/**
 * Gift tokens to a user
 */
export const giftTokensToUser = async (
  targetUserId: string,
  amount: number,
  message?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Create transaction record
    const { error } = await supabase
      .from('token_transactions')
      .insert([{
        user_id: targetUserId,
        amount: amount,
        transaction_type: 'gift',
        gifted_by: user.id,
        gift_message: message || null,
        description: `Gifted ${amount} tokens from admin`
      }]);

    if (error) throw error;

    // Update wallet balance
    const { data: wallet } = await supabase
      .from('token_wallets')
      .select('balance')
      .eq('user_id', targetUserId)
      .single();

    const currentBalance = wallet?.balance || 0;
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
      .from('token_wallets')
      .upsert({ 
        user_id: targetUserId, 
        balance: newBalance,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (updateError) throw updateError;

    // Log admin action
    await logAdminAction('gift_tokens', undefined, targetUserId, {
      amount,
      message,
      new_balance: newBalance
    });

    toast.success(`Successfully gifted ${amount} tokens`);
    return true;
  } catch (error: any) {
    console.error("Error gifting tokens:", error);
    toast.error("Failed to gift tokens");
    return false;
  }
};

/**
 * Gets admin actions for audit trail
 */
export const getAdminActions = async (): Promise<AdminAction[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching admin actions:", error);
    return [];
  }
};

/**
 * Logs admin actions for audit trail
 */
export const logAdminAction = async (
  actionType: string,
  targetIdentifier?: string,
  targetUserId?: string,
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from('admin_actions')
      .insert([{
        admin_user_id: user.id,
        action_type: actionType,
        target_identifier: targetIdentifier,
        target_user_id: targetUserId,
        details: details || {}
      }]);

    if (error) throw error;
  } catch (error: any) {
    console.error("Error logging admin action:", error);
  }
};
