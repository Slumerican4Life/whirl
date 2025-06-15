
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Gift, Shield, Activity, Users } from 'lucide-react';
import { 
  searchUsersByIdentifier, 
  giftTokensToUser, 
  getAdminActions,
  type UserSearchResult,
  type AdminAction 
} from '@/lib/admin-queries';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [giftAmount, setGiftAmount] = useState(100);
  const [giftMessage, setGiftMessage] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: adminActions = [] } = useQuery({
    queryKey: ['admin-actions'],
    queryFn: getAdminActions,
  });

  const giftTokensMutation = useMutation({
    mutationFn: ({ userId, amount, message }: { userId: string; amount: number; message?: string }) =>
      giftTokensToUser(userId, amount, message),
    onSuccess: () => {
      toast.success('Tokens gifted successfully!');
      setGiftAmount(100);
      setGiftMessage('');
      queryClient.invalidateQueries({ queryKey: ['admin-actions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to gift tokens');
    },
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchUsersByIdentifier(searchTerm);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('No users found matching your search');
      }
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGiftTokens = (userId: string, username: string) => {
    if (giftAmount <= 0) {
      toast.error('Gift amount must be greater than 0');
      return;
    }

    giftTokensMutation.mutate({
      userId,
      amount: giftAmount,
      message: giftMessage || `Tokens gifted to ${username}`,
    });
  };

  const formatActionDetails = (details: any) => {
    if (typeof details === 'string') {
      try {
        return JSON.parse(details);
      } catch {
        return details;
      }
    }
    return details;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-6 w-6 text-blue-500" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-blue-600">
                <Activity className="h-4 w-4 mr-2" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              {/* User Search */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={searchLoading}>
                      {searchLoading ? 'Searching...' : 'Search'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-3">
                      {searchResults.map((user) => (
                        <Card key={user.id} className="bg-gray-600 border-gray-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar_url || '/placeholder.svg'}
                                  alt={user.username || 'User'}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <h4 className="text-white font-semibold">
                                    {user.username || 'Unknown User'}
                                  </h4>
                                  <p className="text-gray-400 text-sm">ID: {user.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-white">{user.tokens} tokens</p>
                                  {user.role && (
                                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                                      {user.role}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleGiftTokens(user.id, user.username || 'User')}
                                  disabled={giftTokensMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Gift className="h-4 w-4 mr-1" />
                                  Gift
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Token Gifting Settings */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Gift Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium">Gift Amount</label>
                    <Input
                      type="number"
                      value={giftAmount}
                      onChange={(e) => setGiftAmount(Number(e.target.value))}
                      min="1"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Gift Message (optional)</label>
                    <Input
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Enter a message for the gift..."
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Recent Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {adminActions.map((action) => {
                      const details = formatActionDetails(action.details);
                      return (
                        <div key={action.id} className="bg-gray-600 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                              {action.action_type}
                            </Badge>
                            <span className="text-gray-400 text-sm">
                              {new Date(action.created_at).toLocaleString()}
                            </span>
                          </div>
                          {action.target_identifier && (
                            <p className="text-gray-300 text-sm">
                              Target: {action.target_identifier}
                            </p>
                          )}
                          {details && typeof details === 'object' && (
                            <div className="text-gray-300 text-sm mt-2">
                              {Object.entries(details).map(([key, value]) => (
                                <div key={key}>
                                  <strong>{key}:</strong> {String(value)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
