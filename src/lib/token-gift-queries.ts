
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
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    // Check if user is owner by email
    const { data: ownerSettings } = await supabase
      .from('owner_settings')
      .select('current_owner_email')
      .single();

    const isOwner = ownerSettings?.current_owner_email === user.email;
    const hasPermission = isOwner || userRole?.role === 'manager' || userRole?.role === 'admin';

    if (!hasPermission) {
      toast.error("You don't have permission to gift tokens");
      return false;
    }

    // Check if recipient exists by email - first try to find by email in auth metadata
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*');

    // For now, we'll use the user ID lookup based on username/email similarity
    const recipient = (allProfiles || []).find(p => 
      p.username === recipientEmail || 
      p.id === recipientEmail
    );

    // Create token transaction for the gift
    const { error: transactionError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: recipient?.id || user.id,
        amount: amount,
        transaction_type: 'purchase', // Changed from 'gift' to 'purchase' since 'gift' isn't in the enum
        recipient_email: recipientEmail,
        gift_message: message,
        gifted_by: user.id,
        description: `Token gift to ${recipientEmail}`
      });

    if (transactionError) throw transactionError;

    // If recipient exists, add tokens to their wallet
    if (recipient) {
      const { data: wallet } = await supabase
        .from('token_wallets')
        .select('balance')
        .eq('user_id', recipient.id)
        .single();

      if (wallet) {
        await supabase
          .from('token_wallets')
          .update({ balance: wallet.balance + amount })
          .eq('user_id', recipient.id);
      } else {
        // Create wallet if it doesn't exist
        await supabase
          .from('token_wallets')
          .insert({ user_id: recipient.id, balance: amount });
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
      .select('id, amount, recipient_email, gift_message, gifted_by, created_at, description')
      .not('recipient_email', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map the data to match TokenGift interface
    const gifts: TokenGift[] = (data || []).map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      recipient_email: transaction.recipient_email || '',
      gift_message: transaction.gift_message,
      gifted_by: transaction.gifted_by || '',
      created_at: transaction.created_at,
      description: transaction.description
    }));

    return gifts;
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
      .is('user_id', null);

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
      const { data: wallet } = await supabase
        .from('token_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        await supabase
          .from('token_wallets')
          .update({ balance: wallet.balance + totalTokens })
          .eq('user_id', user.id);
      } else {
        // Create wallet if it doesn't exist
        await supabase
          .from('token_wallets')
          .insert({ user_id: user.id, balance: totalTokens });
      }

      toast.success(`Claimed ${totalTokens} gifted tokens!`);
    }

    return totalTokens;
  } catch (error: any) {
    console.error("Error claiming tokens:", error);
    return 0;
  }
};
