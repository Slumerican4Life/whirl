
import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import { useRole } from '@/hooks/useRole';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const Admin = () => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (role !== 'owner' && role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
