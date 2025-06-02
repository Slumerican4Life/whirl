
import { useState, useEffect } from 'react';
import { getUserRole, hasRole, isCurrentOwner, type AppRole } from '@/lib/role-queries';
import { useAuth } from '@/contexts/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole('user');
        setLoading(false);
        return;
      }

      try {
        const userRole = await getUserRole();
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const checkRole = async (targetRole: AppRole): Promise<boolean> => {
    if (!user) return false;
    return await hasRole(targetRole);
  };

  const checkIsOwner = async (): Promise<boolean> => {
    if (!user) return false;
    return await isCurrentOwner();
  };

  return {
    role,
    loading,
    isOwner: role === 'owner',
    isAdmin: role === 'admin' || role === 'owner',
    isManager: role === 'manager' || role === 'admin' || role === 'owner',
    checkRole,
    checkIsOwner
  };
};
