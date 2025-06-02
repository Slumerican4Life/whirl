
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  transferOwnership, 
  assignRole, 
  getUsersWithRoles, 
  getRoleChangeLogs,
  type AppRole 
} from '@/lib/role-queries';
import { giftTokens, getTokenGiftHistory } from '@/lib/token-gift-queries';

const RoleManagementPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [giftHistory, setGiftHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Owner transfer form
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  
  // Role assignment form
  const [assignEmail, setAssignEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  
  // Token gift form
  const [giftEmail, setGiftEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState(100);
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, logsData, historyData] = await Promise.all([
        getUsersWithRoles(),
        getRoleChangeLogs(),
        getTokenGiftHistory()
      ]);
      
      setUsers(usersData);
      setLogs(logsData);
      setGiftHistory(historyData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!newOwnerEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const success = await transferOwnership(newOwnerEmail);
    if (success) {
      setNewOwnerEmail('');
      loadData();
    }
  };

  const handleAssignRole = async () => {
    if (!assignEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Find user by email (simplified lookup)
    const user = users.find(u => u.username === assignEmail || u.id === assignEmail);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const success = await assignRole(user.id, selectedRole);
    if (success) {
      setAssignEmail('');
      setSelectedRole('user');
      loadData();
    }
  };

  const handleGiftTokens = async () => {
    if (!giftEmail.trim() || giftAmount <= 0) {
      toast.error('Please enter valid email and amount');
      return;
    }

    const success = await giftTokens(giftEmail, giftAmount, giftMessage);
    if (success) {
      setGiftEmail('');
      setGiftAmount(100);
      setGiftMessage('');
      loadData();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-500';
      case 'admin': return 'bg-red-500';
      case 'manager': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={loadData} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="tokens">Token Gifts</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="assign-email">Email/Username</Label>
                  <Input
                    id="assign-email"
                    value={assignEmail}
                    onChange={(e) => setAssignEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="assign-role">Role</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAssignRole} className="w-full">
                    Assign Role
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.username || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{user.id}</div>
                    </div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Ownership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-owner">New Owner Email</Label>
                  <Input
                    id="new-owner"
                    type="email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="newowner@example.com"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleTransferOwnership}
                    className="w-full"
                    variant="destructive"
                  >
                    Transfer Ownership
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                ⚠️ This action cannot be undone. The new owner will have full control of the platform.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gift Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="gift-email">Recipient Email</Label>
                  <Input
                    id="gift-email"
                    type="email"
                    value={giftEmail}
                    onChange={(e) => setGiftEmail(e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="gift-amount">Amount</Label>
                  <Input
                    id="gift-amount"
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="gift-message">Message (Optional)</Label>
                  <Input
                    id="gift-message"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Welcome bonus!"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleGiftTokens} className="w-full">
                    Gift Tokens
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gift History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {giftHistory.map((gift) => (
                  <div key={gift.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{gift.amount} tokens → {gift.recipient_email}</div>
                      <div className="text-sm text-gray-500">
                        {gift.gift_message && `"${gift.gift_message}"`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(gift.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {log.target_email} → {log.new_role}
                        </div>
                        <div className="text-sm text-gray-500">{log.reason}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleManagementPanel;
