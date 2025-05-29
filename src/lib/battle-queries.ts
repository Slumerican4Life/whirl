
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Battle {
  id: string;
  video1_id: string;
  video2_id: string;
  category: string;
  start_time: string;
  end_time: string;
  status: 'active' | 'completed' | 'upcoming';
  winner_video_id: string | null;
  created_at: string;
  video1?: {
    id: string;
    title: string;
    thumbnail_url: string;
    user_id: string;
    user_profile?: {
      username: string;
      avatar_url: string;
    };
  };
  video2?: {
    id: string;
    title: string;
    thumbnail_url: string;
    user_id: string;
    user_profile?: {
      username: string;
      avatar_url: string;
    };
  };
  vote_counts?: {
    video1_votes: number;
    video2_votes: number;
  };
}

/**
 * Fetches all battles with video and user details
 */
export const getBattles = async (): Promise<Battle[]> => {
  try {
    const { data: battles, error } = await supabase
      .from('battles')
      .select(`
        *,
        video1:videos!battles_video1_id_fkey (
          id,
          title,
          thumbnail_url,
          user_id,
          user_profile:profiles (
            username,
            avatar_url
          )
        ),
        video2:videos!battles_video2_id_fkey (
          id,
          title,
          thumbnail_url,
          user_id,
          user_profile:profiles (
            username,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get vote counts for each battle
    const battlesWithVotes = await Promise.all(
      (battles || []).map(async (battle) => {
        const { data: votes } = await supabase
          .from('votes')
          .select('video_id')
          .in('video_id', [battle.video1_id, battle.video2_id]);

        const video1_votes = (votes || []).filter(v => v.video_id === battle.video1_id).length;
        const video2_votes = (votes || []).filter(v => v.video_id === battle.video2_id).length;

        return {
          ...battle,
          vote_counts: {
            video1_votes,
            video2_votes
          }
        };
      })
    );

    return battlesWithVotes;
  } catch (error: any) {
    console.error("Error fetching battles:", error);
    toast.error("Failed to load battles");
    return [];
  }
};

/**
 * Gets active battles
 */
export const getActiveBattles = async (): Promise<Battle[]> => {
  const battles = await getBattles();
  const now = new Date();
  
  return battles.filter(battle => {
    const startTime = new Date(battle.start_time);
    const endTime = new Date(battle.end_time);
    return now >= startTime && now <= endTime && battle.status === 'active';
  });
};

/**
 * Gets battles by category
 */
export const getBattlesByCategory = async (category: string): Promise<Battle[]> => {
  const battles = await getBattles();
  return battles.filter(battle => 
    battle.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Gets a specific battle by ID
 */
export const getBattle = async (id: string): Promise<Battle | null> => {
  const battles = await getBattles();
  return battles.find(battle => battle.id === id) || null;
};

/**
 * Creates a new battle between two videos
 */
export const createBattle = async (
  video1Id: string,
  video2Id: string,
  category: string,
  durationHours: number = 24
): Promise<Battle | null> => {
  try {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + durationHours);

    const { data: battle, error } = await supabase
      .from('battles')
      .insert({
        video1_id: video1Id,
        video2_id: video2Id,
        category,
        end_time: endTime.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("Battle created successfully!");
    return battle;
  } catch (error: any) {
    console.error("Error creating battle:", error);
    toast.error("Failed to create battle");
    return null;
  }
};

/**
 * Vote in a battle
 */
export const voteInBattle = async (battleId: string, videoId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to vote");
      return false;
    }

    // Check if user already voted in this battle
    const battle = await getBattle(battleId);
    if (!battle) {
      toast.error("Battle not found");
      return false;
    }

    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)
      .in('video_id', [battle.video1_id, battle.video2_id])
      .single();

    if (existingVote) {
      toast.error("You've already voted in this battle!");
      return false;
    }

    // Create the vote
    const { error } = await supabase
      .from('votes')
      .insert({
        video_id: videoId,
        user_id: user.id,
        tokens_spent: 1
      });

    if (error) throw error;

    toast.success("Vote recorded!");
    return true;
  } catch (error: any) {
    console.error("Error voting:", error);
    toast.error("Failed to record vote");
    return false;
  }
};
