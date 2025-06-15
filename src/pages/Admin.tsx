
import React from 'react';
import { useRole } from '@/hooks/useRole';
import AdminPanel from '@/components/AdminPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Shield, AlertTriangle } from 'lucide-react';

const Admin = () => {
  const { role, loading: roleLoading, isAdmin, isOwner } = useRole();

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin && !isOwner) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <span className="text-blue-400 text-sm">({role})</span>
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;
