
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

    // For other roles, check user_roles table
    const { data, error } = await supabase
      .from('user_roles' as any)
      .select('role')
      .eq('user_id', user.id)
      .eq('role', role)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking role:", error);
      return false;
    }

    return !!data;
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

    // Check if user is owner first
    if (await isCurrentOwner()) {
      return 'owner';
    }

    // Get highest role from user_roles table
    const { data } = await supabase
      .from('user_roles' as any)
      .select('role')
      .eq('user_id', targetUserId)
      .order('role', { ascending: true })
      .limit(1)
      .single();

    return (data as any)?.role || 'user';
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

    // Check against owner_settings table
    const { data } = await supabase
      .from('owner_settings' as any)
      .select('current_owner_email')
      .single();

    return (data as any)?.current_owner_email === user.email;
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

    // Get current role for logging
    const currentRole = await getUserRole(userId);

    // Assign new role
    const { error } = await supabase
      .from('user_roles' as any)
      .upsert({
        user_id: userId,
        role: role,
        assigned_by: user.id,
        assigned_at: new Date().toISOString()
      });

    if (error) throw error;

    // Log the role change
    await supabase
      .from('role_change_log' as any)
      .insert({
        target_user_id: userId,
        previous_role: currentRole,
        new_role: role,
        changed_by: user.id,
        reason: reason || `Role assigned to ${role}`
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

    const isOwner = await isCurrentOwner();
    if (!isOwner) {
      toast.error("Only the owner can transfer ownership");
      return false;
    }

    // Update owner settings
    const { error } = await supabase
      .from('owner_settings' as any)
      .update({ 
        current_owner_email: newOwnerEmail,
        updated_at: new Date().toISOString()
      })
      .eq('current_owner_email', user.email);

    if (error) throw error;

    // Log the ownership transfer
    await supabase
      .from('role_change_log' as any)
      .insert({
        target_email: newOwnerEmail,
        previous_role: 'user',
        new_role: 'owner',
        changed_by: user.id,
        reason: 'Ownership transfer'
      });

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

    // Get all user roles
    const { data: userRoles } = await supabase
      .from('user_roles' as any)
      .select('*');

    // Get current owner email
    const { data: ownerSettings } = await supabase
      .from('owner_settings' as any)
      .select('current_owner_email')
      .single();

    const ownerEmail = (ownerSettings as any)?.current_owner_email;

    // Combine profiles with roles
    const usersWithRoles = (profiles || []).map(profile => {
      const userRole = (userRoles as any)?.find((ur: any) => ur.user_id === profile.id);
      const isOwner = profile.username === ownerEmail || profile.id === ownerEmail;
      
      return {
        ...profile,
        role: isOwner ? 'owner' : (userRole?.role || 'user'),
        assigned_at: userRole?.assigned_at || profile.created_at,
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
      .from('role_change_log' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching role logs:", error);
    return [];
  }
};
