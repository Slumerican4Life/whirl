
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Battle } from "@/lib/battle-queries";

interface BattleCardProps {
  battle: Battle;
}

const BattleCard = ({ battle }: BattleCardProps) => {
  if (!battle.video1 || !battle.video2) {
    return null;
  }

  const getBattleStatusColor = (status: Battle['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const video1VoteCount = battle.vote_counts?.video1_votes || 0;
  const video2VoteCount = battle.vote_counts?.video2_votes || 0;
  const totalVotes = video1VoteCount + video2VoteCount;

  return (
    <Link to={`/battle/${battle.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 bg-battle-bg border-whirl-purple/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-whirl-purple hover:bg-whirl-purple">{battle.category}</Badge>
            <div className={`h-2 w-2 rounded-full ${getBattleStatusColor(battle.status)}`}></div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Battle: {battle.category}</h3>
          
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="flex-1 bg-black/30 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={battle.video1.thumbnail_url || '/placeholder.svg'} 
                  alt={battle.video1.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black/80 to-transparent w-full">
                  <p className="text-sm font-semibold text-white">
                    {battle.video1.user_profile?.username || 'Anonymous'}
                  </p>
                  {totalVotes > 0 && (
                    <p className="text-xs text-green-400">
                      {video1VoteCount} votes ({Math.round((video1VoteCount / totalVotes) * 100)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <div className="bg-whirl-purple text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                VS
              </div>
            </div>
            
            <div className="md:hidden flex items-center justify-center py-2">
              <div className="bg-whirl-purple text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                VS
              </div>
            </div>
            
            <div className="flex-1 bg-black/30 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={battle.video2.thumbnail_url || '/placeholder.svg'} 
                  alt={battle.video2.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black/80 to-transparent w-full">
                  <p className="text-sm font-semibold text-white">
                    {battle.video2.user_profile?.username || 'Anonymous'}
                  </p>
                  {totalVotes > 0 && (
                    <p className="text-xs text-green-400">
                      {video2VoteCount} votes ({Math.round((video2VoteCount / totalVotes) * 100)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {battle.status === 'active' && (
            <div className="mt-4 text-center">
              <p className="text-sm text-whirl-purple font-medium">
                🔥 Battle Active - Vote Now! 🔥
              </p>
              <p className="text-xs text-gray-400">
                Total votes: {totalVotes}
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default BattleCard;
