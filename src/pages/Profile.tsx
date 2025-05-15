
import { useState, useEffect } from "react";
import { users, getUser } from "@/lib/data"; // getUser might not be needed if using auth user
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/lib/data";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import TokenPurchaseOptions from "@/components/TokenPurchaseOptions";
import { Coins } from "lucide-react";

const ProfilePage = () => {
  const { user, loading: authLoading } = useRequireAuth();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  
  // Use the first user for demo data, will be replaced by auth user where possible
  const demoUser = users[0];
  
  // Get videos for this user
  // TODO: Replace with videos uploaded by the authenticated user
  const userVideos = videos.filter(video => video.userId === demoUser.id); 

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (user) {
        setLoadingBalance(true);
        try {
          const { data, error } = await supabase
            .from('token_wallets')
            .select('balance')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
            throw error;
          }
          setTokenBalance(data?.balance ?? 0);
        } catch (e) {
          console.error("Error fetching token balance:", e);
          setTokenBalance(0); // Default to 0 on error
        } finally {
          setLoadingBalance(false);
        }
      } else {
        setTokenBalance(null);
        setLoadingBalance(false);
      }
    };

    if (!authLoading) {
      fetchTokenBalance();
    }
  }, [user, authLoading]);

  if (authLoading || (user && loadingBalance)) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <div className="animate-pulse text-lg">Loading Profile...</div>
      </div>
    );
  }
  
  if (!user) {
     // This should ideally be handled by useRequireAuth redirecting to login
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const displayUsername = user.user_metadata?.username || user.email?.split('@')[0] || "User";
  const displayAvatar = user.user_metadata?.avatar_url || demoUser.avatar; // Use Supabase avatar, fallback to demo

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-4 relative">
              <img 
                src={displayAvatar} 
                alt={displayUsername} 
                className="rounded-full border-4 border-whirl-purple animate-pulse-glow"
              />
              {/* TODO: Fetch wins from a proper user_stats table or similar */}
              <div className="absolute -bottom-2 -right-2 bg-whirl-purple text-white rounded-full px-2 py-1 text-xs font-semibold">
                {demoUser.wins} Wins 
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {displayUsername}
            </h1>
            
            {tokenBalance !== null && (
              <div className="flex items-center text-lg text-whirl-orange mb-3">
                <Coins className="w-5 h-5 mr-2" />
                <span>{tokenBalance} Tokens</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {/* TODO: Fetch badges for the authenticated user */}
              {demoUser.badges.map((badge) => (
                <Badge key={badge.id} className="bg-card/70 hover:bg-card/70 text-foreground">
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <TokenPurchaseOptions />
          </div>
          
          <Tabs defaultValue="videos" className="mb-8">
            <TabsList className="grid grid-cols-2 mb-6 mx-auto max-w-md">
              <TabsTrigger value="videos">My Videos</TabsTrigger>
              <TabsTrigger value="badges">My Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              {userVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No videos uploaded yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="badges">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* TODO: Fetch badges for the authenticated user */}
                {demoUser.badges.map((badge) => (
                  <div key={badge.id} className="p-4 bg-card rounded-lg flex items-center">
                    <div className="text-4xl mr-3">{badge.icon}</div>
                    <div>
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

