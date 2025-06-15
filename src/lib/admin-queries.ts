
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
