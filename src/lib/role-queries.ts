
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AppRole = 'owner' | 'admin' | 'manager' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
  assigned_by: string | null;
  permissions: Record<string, any>;
}

export interface RoleChangeLog {
  id: string;
  target_user_id: string | null;
  target_email: string | null;
  previous_role: AppRole | null;
  new_role: AppRole | null;
  changed_by: string | null;
  reason: string | null;
  created_at: string;
}

/**
 * Check if current user has a specific role
 */
export const hasRole = async (role: AppRole): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user is owner by email
    if (role === 'owner') {
      return await isCurrentOwner();
    }

    // For other roles, check user_roles table via direct query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    // Simple role check - in a real app you'd have a proper user_roles table
    // For now, we'll use a simple email-based check
    const ownerEmail = 'cleanasawhistle1000@gmail.com';
    if (user.email === ownerEmail) {
      return role === 'owner' || role === 'admin' || role === 'manager';
    }

    return role === 'user';
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

/**
 * Get current user's role
 */
export const getUserRole = async (userId?: string): Promise<AppRole> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) return 'user';

    // Get user email
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return 'user';

    // Check if user is owner
    const ownerEmail = 'cleanasawhistle1000@gmail.com';
    if (userData.user.email === ownerEmail) {
      return 'owner';
    }

    // Default to user role
    return 'user';
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'user';
  }
};

/**
 * Check if current user is owner
 */
export const isCurrentOwner = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return false;

    const ownerEmail = 'cleanasawhistle1000@gmail.com';
    return user.email === ownerEmail;
  } catch (error) {
    console.error("Error checking owner status:", error);
    return false;
  }
};

/**
 * Assign role to a user
 */
export const assignRole = async (userId: string, role: AppRole, reason?: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return false;
    }

    // Check if user has permission to assign roles
    const canAssign = await isCurrentOwner();
    if (!canAssign) {
      toast.error("You don't have permission to assign roles");
      return false;
    }

    // For now, we'll store role assignments in a simple way
    // In a production app, you'd have a proper user_roles table
    toast.success(`Role ${role} assigned successfully (demo mode)`);
    return true;
  } catch (error: any) {
    console.error("Error assigning role:", error);
    toast.error("Failed to assign role");
    return false;
  }
};

/**
 * Transfer ownership to new email
 */
export const transferOwnership = async (newOwnerEmail: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return false;
    }

    const isOwner = await isCurrentOwner();
    if (!isOwner) {
      toast.error("Only the owner can transfer ownership");
      return false;
    }

    // In a real app, you'd update the owner_settings table
    // For now, we'll just show a success message
    toast.success(`Ownership would be transferred to ${newOwnerEmail} (demo mode)`);
    return true;
  } catch (error: any) {
    console.error("Error transferring ownership:", error);
    toast.error("Failed to transfer ownership");
    return false;
  }
};

/**
 * Get all users with their roles
 */
export const getUsersWithRoles = async () => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    // Mock role data since we don't have the user_roles table in types yet
    const usersWithRoles = (profiles || []).map(profile => ({
      ...profile,
      role: profile.id === 'cleanasawhistle1000@gmail.com' ? 'owner' : 'user',
      assigned_at: profile.created_at,
      permissions: {}
    }));

    return usersWithRoles;
  } catch (error: any) {
    console.error("Error fetching users with roles:", error);
    toast.error("Failed to load users");
    return [];
  }
};

/**
 * Get role change logs
 */
export const getRoleChangeLogs = async (): Promise<RoleChangeLog[]> => {
  try {
    // Mock data since we don't have role_change_log table in types yet
    const mockLogs: RoleChangeLog[] = [
      {
        id: '1',
        target_user_id: null,
        target_email: 'cleanasawhistle1000@gmail.com',
        previous_role: null,
        new_role: 'owner',
        changed_by: null,
        reason: 'Initial setup',
        created_at: new Date().toISOString()
      }
    ];

    return mockLogs;
  } catch (error: any) {
    console.error("Error fetching role logs:", error);
    return [];
  }
};
