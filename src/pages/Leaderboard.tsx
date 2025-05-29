
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import { Award } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getTopUsers, UserWithStats } from "@/lib/user-queries";

const LeaderboardPage = () => {
  const { loading } = useRequireAuth();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");
  const [topUsers, setTopUsers] = useState<UserWithStats[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const users = await getTopUsers(50);
        setTopUsers(users);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (!loading) {
      fetchUsers();
    }
  }, [loading]);
  
  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  const renderUserRank = (user: UserWithStats, index: number) => {
    return (
      <div key={user.id} className="flex items-center p-4 hover:bg-card/80 rounded-lg transition-colors">
        <div className="mr-4 text-xl font-bold w-8 text-center">
          {index + 1}
        </div>
        
        <div className="flex items-center flex-1">
          <div className="relative">
            <img 
              src={user.avatar_url || `https://api.dicebear.com/8.x/micah/svg?seed=${user.id}`} 
              alt={user.username || 'Anonymous'} 
              className="w-10 h-10 rounded-full mr-3"
            />
            {index < 3 && (
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs
                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
          
          <div>
            <div className="font-medium">{user.username || 'Anonymous'}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {user.badges?.slice(0, 2).map((badge) => (
                <span key={badge.id} title={badge.description}>{badge.icon}</span>
              ))}
              {user.badges && user.badges.length > 2 && <span>+{user.badges.length - 2}</span>}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold">{user.wins}</div>
          <div className="text-xs text-muted-foreground">wins</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Award className="h-12 w-12 text-whirl-purple mb-2" />
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground text-center">
              The top Whirl champions competing for glory
            </p>
          </div>
          
          <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as "daily" | "weekly")}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="bg-card/50 rounded-lg">
              <div className="p-2 space-y-1">
                {topUsers.length > 0 ? (
                  topUsers.map((user, index) => renderUserRank(user, index))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No users found. Be the first to upload and battle!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="bg-card/50 rounded-lg">
              <div className="p-2 space-y-1">
                {topUsers.length > 0 ? (
                  topUsers.map((user, index) => renderUserRank(user, index))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No users found. Be the first to upload and battle!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
