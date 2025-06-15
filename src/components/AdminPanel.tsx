
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Gift, Users, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { 
  searchUsers, 
  giftTokensToUser, 
  getAdminActions,
  type AdminUser,
  type AdminAction
} from '@/lib/admin-queries';

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [giftMessage, setGiftMessage] = useState('');

  const { data: searchResults = [], refetch: refetchUsers } = useQuery({
    queryKey: ['admin-search', searchTerm],
    queryFn: () => searchTerm.length >= 2 ? searchUsers(searchTerm) : Promise.resolve([]),
    enabled: searchTerm.length >= 2,
  });

  const { data: adminActions = [] } = useQuery({
    queryKey: ['admin-actions'],
    queryFn: getAdminActions,
  });

  const handleGiftTokens = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }

    if (tokenAmount <= 0) {
      toast.error('Token amount must be greater than 0');
      return;
    }

    const success = await giftTokensToUser(selectedUser.id, tokenAmount, giftMessage);
    if (success) {
      setSelectedUser(null);
      setTokenAmount(100);
      setGiftMessage('');
      refetchUsers();
    }
  };

  const formatActionDetails = (action: AdminAction) => {
    const details = action.details as Record<string, any>;
    switch (action.action_type) {
      case 'token_gift':
        return `Gifted ${details.amount || 0} tokens: ${details.message || 'No message'}`;
      default:
        return JSON.stringify(details);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Search Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5" />
            User Search & Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by email, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button variant="outline" className="border-blue-500 text-blue-500">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-600 border border-blue-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">{user.full_name || 'No name'}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        {user.phone && (
                          <p className="text-gray-400 text-sm">{user.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {user.tokens} tokens
                        </Badge>
                        <p className="text-gray-400 text-xs">{user.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Token Gifting Section */}
      {selectedUser && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gift className="h-5 w-5" />
              Gift Tokens to {selectedUser.full_name || selectedUser.email}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium">Token Amount</label>
                <Input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium">Current Balance</label>
                <div className="h-10 flex items-center px-3 bg-gray-700 rounded-md border border-gray-600">
                  <span className="text-white">{selectedUser.tokens} tokens</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-white text-sm font-medium">Gift Message (Optional)</label>
              <Input
                placeholder="Enter a message for the token gift..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button 
              onClick={handleGiftTokens}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Gift className="h-4 w-4 mr-2" />
              Gift {tokenAmount} Tokens
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions Log */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            Recent Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {adminActions.map((action) => (
                <div key={action.id} className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-purple-500 text-purple-500">
                      {action.action_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-gray-400 text-xs">
                      {new Date(action.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white text-sm">Target: {action.target_identifier}</p>
                  <p className="text-gray-400 text-sm">{formatActionDetails(action)}</p>
                </div>
              ))}
              {adminActions.length === 0 && (
                <p className="text-gray-400 text-center py-4">No admin actions recorded yet</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
