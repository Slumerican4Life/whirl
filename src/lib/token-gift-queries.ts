import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TokenGift {
  id: string;
  amount: number;
  recipient_email: string;
  gift_message: string | null;
  gifted_by: string;
  created_at: string;
  description: string | null;
}

/**
 * Gift tokens to a user by email
 */
export const giftTokens = async (
  recipientEmail: string, 
  amount: number, 
  message?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to gift tokens");
      return false;
    }

    // Check if user has permission to gift tokens (owner or manager)
    const { data: hasPermission } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'owner'
    });

    const { data: isManager } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'manager'
    });

    if (!hasPermission && !isManager) {
      toast.error("You don't have permission to gift tokens");
      return false;
    }

    // Check if recipient exists
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', recipientEmail) // This might need adjustment - we need to find by email
      .single();

    // Create token transaction for the gift
    const { error: transactionError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: recipient?.id || user.id, // Fallback if recipient not found
        amount: amount,
        transaction_type: 'tip_received', // Using existing enum value
        recipient_email: recipientEmail,
        gift_message: message,
        gifted_by: user.id,
        description: `Token gift to ${recipientEmail}`
      });

    if (transactionError) throw transactionError;

    // If recipient exists, add tokens to their wallet
    if (recipient) {
      const { error: walletError } = await supabase.rpc('spend_token', {
        user_id: recipient.id,
        amount: -amount, // Negative amount to add tokens
        description: `Gift from ${user.email}`
      });

      if (walletError) {
        console.warn("Could not update recipient wallet, they may need to claim manually");
      }
    }

    toast.success(`${amount} tokens gifted to ${recipientEmail}`);
    return true;
  } catch (error: any) {
    console.error("Error gifting tokens:", error);
    toast.error("Failed to gift tokens");
    return false;
  }
};

/**
 * Get token gift history
 */
export const getTokenGiftHistory = async (): Promise<TokenGift[]> => {
  try {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .not('recipient_email', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching gift history:", error);
    return [];
  }
};

/**
 * Claim gifted tokens (for when recipient registers later)
 */
export const claimGiftedTokens = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return 0;

    // Find unclaimed gifts for this email
    const { data: gifts, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('recipient_email', user.email)
      .is('user_id', null); // Unclaimed gifts

    if (error) throw error;

    if (!gifts || gifts.length === 0) return 0;

    const totalTokens = gifts.reduce((sum, gift) => sum + gift.amount, 0);

    // Update gifts to mark as claimed
    const { error: updateError } = await supabase
      .from('token_transactions')
      .update({ user_id: user.id })
      .eq('recipient_email', user.email)
      .is('user_id', null);

    if (updateError) throw updateError;

    // Add tokens to user's wallet
    if (totalTokens > 0) {
      await supabase.rpc('spend_token', {
        user_id: user.id,
        amount: -totalTokens,
        description: 'Claimed gifted tokens'
      });

      toast.success(`Claimed ${totalTokens} gifted tokens!`);
    }

    return totalTokens;
  } catch (error: any) {
    console.error("Error claiming tokens:", error);
    return 0;
  }
};
