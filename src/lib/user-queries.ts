
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  total_wins: number;
  total_losses: number;
  battles_participated: number;
  videos_uploaded: number;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned_at: string;
}

export interface UserWithStats extends UserProfile {
  wins: number;
  losses: number;
  battles: number;
  uploads: number;
  badges: UserBadge[];
}

/**
 * Fetches all users with their stats and badges for leaderboard
 */
export const getUsersWithStats = async (): Promise<UserWithStats[]> => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    const usersWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        // Get user stats
        const { data: stats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        // Get user badges
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select(`
            earned_at,
            badge_definitions (
              id,
              name,
              icon,
              description
            )
          `)
          .eq('user_id', profile.id);

        const badges = (userBadges || []).map(ub => ({
          id: ub.badge_definitions.id,
          name: ub.badge_definitions.name,
          icon: ub.badge_definitions.icon,
          description: ub.badge_definitions.description,
          earned_at: ub.earned_at
        }));

        return {
          id: profile.id,
          username: profile.username || 'Anonymous',
          avatar_url: profile.avatar_url || `https://api.dicebear.com/8.x/micah/svg?seed=${profile.id}`,
          created_at: profile.created_at,
          wins: stats?.total_wins || 0,
          losses: stats?.total_losses || 0,
          battles: stats?.battles_participated || 0,
          uploads: stats?.videos_uploaded || 0,
          badges: badges
        };
      })
    );

    return usersWithStats;
  } catch (error: any) {
    console.error("Error fetching users with stats:", error);
    toast.error("Failed to load users");
    return [];
  }
};

/**
 * Gets top users sorted by wins
 */
export const getTopUsers = async (limit: number = 50): Promise<UserWithStats[]> => {
  const users = await getUsersWithStats();
  return users
    .sort((a, b) => b.wins - a.wins)
    .slice(0, limit);
};

/**
 * Gets user by ID with stats and badges
 */
export const getUserWithStats = async (userId: string): Promise<UserWithStats | null> => {
  try {
    const users = await getUsersWithStats();
    return users.find(user => user.id === userId) || null;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return null;
  }
};
