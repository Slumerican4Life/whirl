
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  tokens: number;
  role: string;
}

export interface AdminAction {
  id: string;
  action_type: "token_gift" | "user_search" | "role_assignment";
  admin_user_id: string;
  target_user_id: string;
  target_identifier: string;
  details: Record<string, any>;
  created_at: string;
}

export const searchUsers = async (searchTerm: string): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return (data || []).map(user => ({
      id: user.id,
      email: user.email || '',
      phone: user.phone || '',
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      tokens: user.tokens || 0,
      role: user.role || 'user'
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

export const giftTokensToUser = async (
  userId: string, 
  tokenAmount: number, 
  message?: string
): Promise<boolean> => {
  try {
    // First get current admin user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      return false;
    }

    // Get user info for logging
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    // Use edge function to handle token gifting
    const { data, error } = await supabase.functions.invoke('spend-token', {
      body: {
        action: 'admin_gift',
        user_id: userId,
        amount: tokenAmount,
        message: message || 'Admin token gift'
      }
    });

    if (error) {
      console.error('Error gifting tokens:', error);
      toast.error("Failed to gift tokens");
      return false;
    }

    // Log the admin action
    await logAdminAction({
      action_type: 'token_gift',
      admin_user_id: user.id,
      target_user_id: userId,
      target_identifier: targetUser?.email || userId,
      details: {
        amount: tokenAmount,
        message: message || 'Admin token gift'
      }
    });

    toast.success(`Successfully gifted ${tokenAmount} tokens`);
    return true;
  } catch (error) {
    console.error('Error gifting tokens:', error);
    toast.error("Failed to gift tokens");
    return false;
  }
};

export const logAdminAction = async (action: Omit<AdminAction, 'id' | 'created_at'>) => {
  try {
    const { error } = await supabase
      .from('admin_actions')
      .insert([{
        ...action,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error logging admin action:', error);
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

export const getAdminActions = async (): Promise<AdminAction[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching admin actions:', error);
      return [];
    }

    return (data || []).map(action => ({
      id: action.id,
      action_type: action.action_type as "token_gift" | "user_search" | "role_assignment",
      admin_user_id: action.admin_user_id,
      target_user_id: action.target_user_id,
      target_identifier: action.target_identifier,
      details: typeof action.details === 'object' ? action.details as Record<string, any> : {},
      created_at: action.created_at
    }));
  } catch (error) {
    console.error('Error fetching admin actions:', error);
    return [];
  }
};
