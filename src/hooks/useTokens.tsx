
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTokens = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTokenBalance();
      
      // Set up real-time subscription for balance updates
      const channel = supabase
        .channel('token-balance-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'token_wallets',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new && typeof payload.new === 'object' && 'balance' in payload.new) {
              setBalance(payload.new.balance as number);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchTokenBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('token_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching token balance:', error);
        return;
      }
      
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const spendTokens = async (videoId: string, amount: number = 1) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('spend-token', {
        body: { videoId, amount }
      });

      if (error) {
        toast.error('Failed to spend tokens');
        return false;
      }

      if (data?.success) {
        toast.success('Vote cast successfully!');
        await fetchTokenBalance(); // Refresh balance
        return true;
      } else {
        toast.error(data?.message || 'Failed to spend tokens');
        return false;
      }
    } catch (error) {
      console.error('Error spending tokens:', error);
      toast.error('Error casting vote');
      return false;
    }
  };

  return {
    balance,
    loading,
    spendTokens,
    refetch: fetchTokenBalance
  };
};
