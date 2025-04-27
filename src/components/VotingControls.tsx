
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface VotingControlsProps {
  battleId: string;
  videoId: string;
}

const VotingControls = ({ battleId, videoId }: VotingControlsProps) => {
  const [voted, setVoted] = useState(false);
  
  const handleVote = () => {
    // In a real app, this would make an API call to record the vote
    // For now, we'll simulate a successful vote
    
    if (voted) {
      toast.error("You've already voted in this battle!");
      return;
    }
    
    toast.success("Your vote has been recorded!");
    setVoted(true);
  };
  
  return (
    <Button 
      onClick={handleVote}
      disabled={voted}
      className={`w-full ${voted ? 'bg-gray-400' : 'bg-whirl-purple hover:bg-whirl-deep-purple'}`}
    >
      <ThumbsUp className="mr-2 h-4 w-4" />
      {voted ? "Voted" : "Vote"} 
    </Button>
  );
};

export default VotingControls;
