
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Battle, getBattle, getVideo, getUser } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp } from "lucide-react";
import NavBar from "@/components/NavBar";

const BattlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [video1, setVideo1] = useState<any>(null);
  const [video2, setVideo2] = useState<any>(null);
  const [user1, setUser1] = useState<any>(null);
  const [user2, setUser2] = useState<any>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [video1Likes, setVideo1Likes] = useState(0);
  const [video2Likes, setVideo2Likes] = useState(0);
  
  useEffect(() => {
    if (id) {
      const battleData = getBattle(id);
      if (battleData) {
        setBattle(battleData);
        
        const v1 = getVideo(battleData.video1Id);
        const v2 = getVideo(battleData.video2Id);
        
        if (v1 && v2) {
          setVideo1(v1);
          setVideo2(v2);
          setVideo1Likes(v1.likes);
          setVideo2Likes(v2.likes);
          
          const u1 = getUser(v1.userId);
          const u2 = getUser(v2.userId);
          
          if (u1 && u2) {
            setUser1(u1);
            setUser2(u2);
          }
        }
      } else {
        navigate("/not-found");
      }
    }
  }, [id, navigate]);
  
  const handleVote = (videoId: string) => {
    if (votedFor) {
      toast({
        title: "Already voted",
        description: "You've already cast your vote for this battle",
      });
      return;
    }
    
    setVotedFor(videoId);
    
    if (videoId === video1?.id) {
      setVideo1Likes(video1Likes + 1);
      toast({
        title: "Vote cast!",
        description: `You voted for ${user1?.username}'s video`,
      });
    } else if (videoId === video2?.id) {
      setVideo2Likes(video2Likes + 1);
      toast({
        title: "Vote cast!",
        description: `You voted for ${user2?.username}'s video`,
      });
    }
  };
  
  if (!battle || !video1 || !video2 || !user1 || !user2) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <div className="animate-pulse text-xl">Loading battle...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              Battle: <Badge className="bg-whirl-purple">{battle.category}</Badge>
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to Battles
            </Button>
          </div>
          
          <p className="text-muted-foreground">Vote for your favorite video to determine the champion!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video 1 */}
          <div className={`rounded-lg overflow-hidden border-2 ${votedFor === video1.id ? 'border-whirl-purple animate-pulse-glow' : 'border-transparent'}`}>
            <div className="p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={user1.avatar} 
                    alt={user1.username} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{user1.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user1.wins} wins
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                  <span className="text-sm">❤️ {video1Likes}</span>
                </div>
              </div>
              
              <div className="aspect-video bg-black rounded-lg mb-3">
                <img 
                  src={video1.thumbnail} 
                  alt={video1.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              <Button 
                className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
                onClick={() => handleVote(video1.id)}
                disabled={!!votedFor}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {votedFor === video1.id ? "Voted!" : "Vote"}
              </Button>
            </div>
          </div>
          
          {/* Video 2 */}
          <div className={`rounded-lg overflow-hidden border-2 ${votedFor === video2.id ? 'border-whirl-purple animate-pulse-glow' : 'border-transparent'}`}>
            <div className="p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={user2.avatar} 
                    alt={user2.username} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{user2.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user2.wins} wins
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                  <span className="text-sm">❤️ {video2Likes}</span>
                </div>
              </div>
              
              <div className="aspect-video bg-black rounded-lg mb-3">
                <img 
                  src={video2.thumbnail} 
                  alt={video2.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              <Button 
                className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
                onClick={() => handleVote(video2.id)}
                disabled={!!votedFor}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {votedFor === video2.id ? "Voted!" : "Vote"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BattlePage;
