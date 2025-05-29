
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirements: any;
}

export interface UserBadge extends BadgeDefinition {
  earned_at: string;
}

/**
 * Gets all available badge definitions
 */
export const getBadgeDefinitions = async (): Promise<BadgeDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('badge_definitions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching badge definitions:", error);
    return [];
  }
};

/**
 * Gets badges earned by a specific user
 */
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        earned_at,
        badge_definitions (
          id,
          name,
          icon,
          description,
          requirements
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.badge_definitions.id,
      name: item.badge_definitions.name,
      icon: item.badge_definitions.icon,
      description: item.badge_definitions.description,
      requirements: item.badge_definitions.requirements,
      earned_at: item.earned_at
    }));
  } catch (error: any) {
    console.error("Error fetching user badges:", error);
    return [];
  }
};

/**
 * Awards a badge to a user if they don't already have it
 */
export const awardBadge = async (userId: string, badgeId: string): Promise<boolean> => {
  try {
    // Check if user already has this badge
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) {
      return false; // Already has badge
    }

    // Award the badge
    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId
      });

    if (error) throw error;

    // Get badge info for notification
    const { data: badge } = await supabase
      .from('badge_definitions')
      .select('name, icon')
      .eq('id', badgeId)
      .single();

    if (badge) {
      toast.success(`Badge earned: ${badge.icon} ${badge.name}!`);
    }

    return true;
  } catch (error: any) {
    console.error("Error awarding badge:", error);
    return false;
  }
};

/**
 * Checks and awards badges based on user stats
 */
export const checkAndAwardBadges = async (userId: string): Promise<void> => {
  try {
    // Get user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!stats) return;

    // Get all badge definitions
    const badges = await getBadgeDefinitions();

    // Check each badge requirement
    for (const badge of badges) {
      const req = badge.requirements;
      let qualifies = false;

      if (req.videos_uploaded && stats.videos_uploaded >= req.videos_uploaded) {
        qualifies = true;
      } else if (req.total_wins && stats.total_wins >= req.total_wins) {
        qualifies = true;
      } else if (req.battles_participated && stats.battles_participated >= req.battles_participated) {
        qualifies = true;
      }

      if (qualifies) {
        await awardBadge(userId, badge.id);
      }
    }
  } catch (error: any) {
    console.error("Error checking badges:", error);
  }
};
