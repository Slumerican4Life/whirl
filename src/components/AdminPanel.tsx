
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Gift, Crown, Users, Mail, Phone, Coins } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  email?: string;
}

interface TokenWallet {
  balance: number;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [giftAmount, setGiftAmount] = useState(100);
  const [giftMessage, setGiftMessage] = useState('');

  // Search users by email or phone
  const searchUsersMutation = useMutation({
    mutationFn: async (query: string) => {
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
      return profiles;
    },
    onSuccess: (users) => {
      if (users.length === 0) {
        toast.error('No users found');
      } else {
        toast.success(`Found ${users.length} user(s)`);
      }
    }
  });

  // Get user's token balance
  const { data: userBalance } = useQuery({
    queryKey: ['user-balance', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return null;
      
      const { data, error } = await supabase
        .from('token_wallets')
        .select('balance')
        .eq('user_id', selectedUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedUser
  });

  // Gift tokens mutation
  const giftTokensMutation = useMutation({
    mutationFn: async ({ userId, amount, message }: { userId: string; amount: number; message: string }) => {
      // First ensure user has a token wallet
      const { error: walletError } = await supabase
        .from('token_wallets')
        .upsert({ 
          user_id: userId, 
          balance: 0 
        }, { 
          onConflict: 'user_id',
          ignoreDuplicates: true 
        });
      
      if (walletError) throw walletError;
      
      // Add tokens to user's wallet
      const { error: updateError } = await supabase.rpc('spend_token', {
        p_user_id: userId,
        p_amount: -amount, // Negative to add tokens
        p_description: 'Admin gift',
        p_transaction_type: 'gift'
      });
      
      if (updateError) throw updateError;
      
      // Log admin action
      const { error: logError } = await supabase
        .from('admin_actions')
        .insert({
          admin_user_id: user?.id,
          action_type: 'token_gift',
          target_user_id: userId,
          details: {
            amount,
            message,
            timestamp: new Date().toISOString()
          }
        });
      
      if (logError) throw logError;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success(`Successfully gifted ${giftAmount} tokens!`);
      setGiftAmount(100);
      setGiftMessage('');
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
    },
    onError: (error) => {
      console.error('Gift tokens error:', error);
      toast.error('Failed to gift tokens');
    }
  });

  // Recent admin actions
  const { data: adminActions } = useQuery({
    queryKey: ['admin-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    searchUsersMutation.mutate(searchQuery);
  };

  const handleGiftTokens = () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }
    
    if (giftAmount <= 0) {
      toast.error('Gift amount must be positive');
      return;
    }
    
    giftTokensMutation.mutate({
      userId: selectedUser.id,
      amount: giftAmount,
      message: giftMessage
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-white">Admin Control Panel</h1>
          <Badge className="bg-red-600">OWNER ACCESS</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Search & Token Gifting */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                User Search & Token Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Section */}
              <div className="space-y-3">
                <Label className="text-white">Search by Email or Phone</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter email or phone number..."
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={searchUsersMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {searchUsersMutation.isPending ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchUsersMutation.data && (
                <div className="space-y-3">
                  <Label className="text-white">Search Results</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchUsersMutation.data.map((user: any) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedUser?.id === user.id
                            ? 'bg-blue-600 border-blue-500'
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium">
                              {user.username || 'Anonymous User'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              {user.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                              )}
                              {user.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected User Info */}
              {selectedUser && (
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Selected User</h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
                    <p><strong>User ID:</strong> {selectedUser.id}</p>
                    <p><strong>Current Tokens:</strong> {userBalance?.balance || 0}</p>
                    <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Token Gifting */}
              {selectedUser && (
                <div className="space-y-3 border-t border-gray-600 pt-4">
                  <Label className="text-white flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Gift Tokens
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300 text-sm">Amount</Label>
                      <Input
                        type="number"
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(parseInt(e.target.value) || 0)}
                        min="1"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Message (Optional)</Label>
                      <Input
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Gift message..."
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleGiftTokens}
                    disabled={giftTokensMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    {giftTokensMutation.isPending ? 'Gifting...' : `Gift ${giftAmount} Tokens`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Admin Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {adminActions?.map((action) => (
                  <div key={action.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-600">
                        {action.action_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(action.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {action.action_type === 'token_gift' && (
                        <p>
                          Gifted {action.details?.amount || 'unknown'} tokens
                          {action.details?.message && ` - "${action.details.message}"`}
                        </p>
                      )}
                      {action.target_identifier && (
                        <p className="text-xs text-gray-400 mt-1">
                          Target: {action.target_identifier}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {adminActions?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No admin actions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
