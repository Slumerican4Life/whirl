
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Battle, getBattle, getVideo, getUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VotingControls from "@/components/VotingControls";
import { toast } from "sonner";

const BattlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [video1, setVideo1] = useState<any>(null);
  const [video2, setVideo2] = useState<any>(null);
  const [user1, setUser1] = useState<any>(null);
  const [user2, setUser2] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const battleData = getBattle(id);
      if (battleData) {
        setBattle(battleData);
        
        const v1 = getVideo(battleData.video1Id);
        const v2 = getVideo(battleData.video2Id);
        setVideo1(v1);
        setVideo2(v2);
        
        if (v1 && v2) {
          const u1 = getUser(v1.userId);
          const u2 = getUser(v2.userId);
          setUser1(u1);
          setUser2(u2);
        }
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-whirl-purple border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (!battle || !video1 || !video2 || !user1 || !user2) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
        <NavBar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-2">Battle Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, this battle doesn't exist or has been removed.
            </p>
            <Button className="mt-6" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Format the battle times
  const startTime = new Date(battle.startTime).toLocaleString();
  const endTime = new Date(battle.endTime).toLocaleString();
  
  // Check if battle is active
  const now = new Date();
  const isActive = now > new Date(battle.startTime) && now < new Date(battle.endTime);
  const isUpcoming = now < new Date(battle.startTime);
  const isCompleted = now > new Date(battle.endTime);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card className="overflow-hidden bg-black/30">
                <div className="relative aspect-video">
                  <video
                    src={video1.url}
                    poster={video1.thumbnail}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{video1.title}</h3>
                  <div className="flex items-center mt-2">
                    <img
                      src={user1.avatar}
                      alt={user1.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user1.username}</span>
                  </div>
                  {isActive && (
                    <div className="mt-4">
                      <VotingControls battleId={battle.id} videoId={video1.id} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="overflow-hidden bg-black/30">
                <div className="relative aspect-video">
                  <video
                    src={video2.url}
                    poster={video2.thumbnail}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{video2.title}</h3>
                  <div className="flex items-center mt-2">
                    <img
                      src={user2.avatar}
                      alt={user2.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user2.username}</span>
                  </div>
                  {isActive && (
                    <div className="mt-4">
                      <VotingControls battleId={battle.id} videoId={video2.id} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 bg-card p-4 rounded-lg">
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
        </div>
      </main>
    </div>
  );
};

export default BattlePage;
