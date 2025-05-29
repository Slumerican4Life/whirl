
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { voteInBattle } from "@/lib/battle-queries";
import { supabase } from "@/integrations/supabase/client";

interface VotingControlsProps {
  battleId: string;
  videoId: string;
}

const VotingControls = ({ battleId, videoId }: VotingControlsProps) => {
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  
  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user already voted in this battle
        const { data: battle } = await supabase
          .from('battles')
          .select('video1_id, video2_id')
          .eq('id', battleId)
          .single();

        if (battle) {
          const { data: existingVote } = await supabase
            .from('votes')
            .select('id')
            .eq('user_id', user.id)
            .in('video_id', [battle.video1_id, battle.video2_id])
            .single();

          setVoted(!!existingVote);
        }

        // Get current vote count for this video
        const { data: votes } = await supabase
          .from('votes')
          .select('id')
          .eq('video_id', videoId);

        setVoteCount(votes?.length || 0);
      } catch (error) {
        console.error("Error checking vote status:", error);
      }
    };

    checkVoteStatus();
  }, [battleId, videoId]);
  
  const handleVote = async () => {
    if (voted) {
      toast.error("You've already voted in this battle!");
      return;
    }

    setVoting(true);
    try {
      const success = await voteInBattle(battleId, videoId);
      if (success) {
        setVoted(true);
        setVoteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoting(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Button 
        onClick={handleVote}
        disabled={voted || voting}
        className={`w-full ${voted ? 'bg-gray-400' : 'bg-whirl-purple hover:bg-whirl-deep-purple'}`}
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        {voting ? "Voting..." : voted ? "Voted" : "Vote"} 
      </Button>
      <div className="text-center text-sm text-gray-400">
        {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
      </div>
    </div>
  );
};

export default VotingControls;
