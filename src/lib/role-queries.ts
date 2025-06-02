
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

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: role
    });

    if (error) throw error;
    return data || false;
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

    const { data, error } = await supabase.rpc('get_user_role', {
      _user_id: targetUserId
    });

    if (error) throw error;
    return (data as AppRole) || 'user';
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
    if (!user) return false;

    const { data, error } = await supabase.rpc('is_current_owner', {
      _user_id: user.id
    });

    if (error) throw error;
    return data || false;
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
    const canAssign = await hasRole('owner');
    if (!canAssign) {
      toast.error("You don't have permission to assign roles");
      return false;
    }

    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        assigned_by: user.id,
        assigned_at: new Date().toISOString()
      });

    if (error) throw error;

    // Log the role change
    await supabase
      .from('role_change_log')
      .insert({
        target_user_id: userId,
        new_role: role,
        changed_by: user.id,
        reason: reason || `Assigned ${role} role`
      });

    toast.success(`Role ${role} assigned successfully`);
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

    const { data, error } = await supabase.rpc('transfer_ownership', {
      _new_owner_email: newOwnerEmail,
      _current_owner_id: user.id
    });

    if (error) throw error;

    toast.success(`Ownership transferred to ${newOwnerEmail}`);
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

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) throw rolesError;

    // Get current owner email
    const { data: ownerSettings } = await supabase
      .from('owner_settings')
      .select('current_owner_email')
      .single();

    const usersWithRoles = (profiles || []).map(profile => {
      const userRole = roles?.find(r => r.user_id === profile.id);
      const isOwner = profile.id && ownerSettings?.current_owner_email && 
        profile.id === ownerSettings.current_owner_email; // This might need adjustment based on how we get user email

      return {
        ...profile,
        role: isOwner ? 'owner' : (userRole?.role || 'user'),
        assigned_at: userRole?.assigned_at,
        permissions: userRole?.permissions || {}
      };
    });

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
    const { data, error } = await supabase
      .from('role_change_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching role logs:", error);
    return [];
  }
};
