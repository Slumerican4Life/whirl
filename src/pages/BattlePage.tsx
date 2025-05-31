
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Battle, getBattle } from "@/lib/battle-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, Trophy } from "lucide-react";
import NavBar from "@/components/NavBar";
import VotingControls from "@/components/VotingControls";
import Comments from "@/components/Comments";
import { toast } from "sonner";

const BattlePage = () => {
  const { id } = useParams();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBattle = async () => {
      if (!id) return;
      
      try {
        const battleData = await getBattle(id);
        setBattle(battleData);
      } catch (error) {
        console.error('Error loading battle:', error);
        toast.error('Failed to load battle');
      } finally {
        setLoading(false);
      }
    };

    loadBattle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen swirl-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-whirl-purple"></div>
          <p className="text-white mt-4">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen swirl-bg flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Battle Not Found</h1>
          <Link to="/">
            <Button className="bg-whirl-purple hover:bg-whirl-deep-purple">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format the battle times using snake_case property names
  const startTime = new Date(battle.start_time).toLocaleString();
  const endTime = new Date(battle.end_time).toLocaleString();
  
  // Check if battle is active using snake_case property names
  const now = new Date();
  const isActive = now > new Date(battle.start_time) && now < new Date(battle.end_time);
  const isUpcoming = now < new Date(battle.start_time);
  const isCompleted = now > new Date(battle.end_time);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {battle.category} Battle
              </h1>
              <p className="text-muted-foreground">
                {isActive && "Active battle - Vote now!"}
                {isUpcoming && "Upcoming battle - Starts soon!"}
                {isCompleted && "This battle has ended"}
              </p>
            </div>
            
            <Badge className={`
              ${isActive ? 'bg-green-500' : ''}
              ${isUpcoming ? 'bg-blue-500' : ''}
              ${isCompleted ? 'bg-gray-500' : ''}
            `}>
              {battle.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <Card className="overflow-hidden bg-black/30">
                <div className="relative aspect-video">
                  <video
                    src={battle.video1?.thumbnail_url}
                    poster={battle.video1?.thumbnail_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{battle.video1?.title}</h3>
                  <div className="flex items-center mt-2">
                    <img
                      src={battle.video1?.user_profile?.avatar_url || '/placeholder.svg'}
                      alt={battle.video1?.user_profile?.username || 'User'}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{battle.video1?.user_profile?.username}</span>
                  </div>
                  {isActive && (
                    <div className="mt-4">
                      <VotingControls battleId={battle.id} videoId={battle.video1?.id || ''} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="overflow-hidden bg-black/30">
                <div className="relative aspect-video">
                  <video
                    src={battle.video2?.thumbnail_url}
                    poster={battle.video2?.thumbnail_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{battle.video2?.title}</h3>
                  <div className="flex items-center mt-2">
                    <img
                      src={battle.video2?.user_profile?.avatar_url || '/placeholder.svg'}
                      alt={battle.video2?.user_profile?.username || 'User'}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{battle.video2?.user_profile?.username}</span>
                  </div>
                  {isActive && (
                    <div className="mt-4">
                      <VotingControls battleId={battle.id} videoId={battle.video2?.id || ''} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
          
          <div className="mb-8 bg-card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Battle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Category:</span> {battle.category}</p>
                <p><span className="font-medium">Status:</span> {battle.status}</p>
              </div>
              <div>
                <p><span className="font-medium">Starts:</span> {startTime}</p>
                <p><span className="font-medium">Ends:</span> {endTime}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <Comments battleId={battle.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BattlePage;
