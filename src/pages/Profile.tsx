import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/VideoCard"; // This component is read-only
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import TokenPurchaseOptions from "@/components/TokenPurchaseOptions";
import { Coins, Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserVideos } from "@/lib/video-queries"; 
import type { Video as DbVideo } from "@/lib/types"; 
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/lib/data"; // Import Category type
import { categories } from "@/lib/data"; // Import categories array

// Define the type expected by VideoCard
interface VideoCardVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  userId: string;
  category: Category; // Changed from string to Category
  likes: number;
  createdAt: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useRequireAuth();
  
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  
  // Fetch user's videos
  const { data: userVideos, isLoading: videosLoading, error: videosError } = useQuery({
    queryKey: ['userVideos', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return getUserVideos(user.id);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (user) {
        setLoadingBalance(true);
        try {
          // Explicitly type the table name if issues persist, but usually not needed with typed client
          const { data, error } = await supabase
            .from('token_wallets') 
            .select('balance')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
            // console.error("Error fetching token balance (non-PGRST116):", error);
            throw error;
          }
          setTokenBalance(data?.balance ?? 0);
        } catch (e: any) {
          console.error("Error fetching token balance:", e.message);
          setTokenBalance(0); 
        } finally {
          setLoadingBalance(false);
        }
      } else {
        setTokenBalance(null); // Clear balance if no user
        setLoadingBalance(false); // Not loading if no user
      }
    };

    if (!authLoading) { // Only fetch if auth is settled
      fetchTokenBalance();
    }
  }, [user, authLoading]);

  if (authLoading || (user && (loadingBalance || videosLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <div className="animate-pulse text-lg text-white">Loading Profile...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <p className="text-white">Please log in to view your profile.</p>
      </div>
    );
  }

  const demoUserBadges = [ // Placeholder until badges are fetched from DB
    { id: "1", name: "First Upload", icon: "🏆", description: "Uploaded your first video." },
    { id: "2", name: "Streak Master", icon: "🔥", description: "Maintained a 5-day upload streak." },
  ];
  const demoUserWins = 0; // Placeholder

  const displayUsername = user.user_metadata?.username || user.email?.split('@')[0] || "User";
  const displayAvatar = user.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/micah/svg?seed=${displayUsername}`;


  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto bg-background/30 backdrop-blur-md p-6 rounded-lg shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-4 relative">
              <img 
                src={displayAvatar} 
                alt={displayUsername} 
                className="rounded-full border-4 border-whirl-purple animate-pulse-glow object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-whirl-purple text-white rounded-full px-2 py-1 text-xs font-semibold">
                {/* TODO: Fetch wins from a proper user_stats table or similar */}
                {demoUserWins} Wins 
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-whirl-text-bright">
              {displayUsername}
            </h1>
            
            {loadingBalance ? (
              <Skeleton className="h-6 w-24 mb-3 bg-slate-700" />
            ) : tokenBalance !== null ? (
              <div className="flex items-center text-lg text-whirl-orange mb-3">
                <Coins className="w-5 h-5 mr-2" />
                <span>{tokenBalance} Tokens</span>
              </div>
            ) : null}
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {/* TODO: Fetch badges for the authenticated user */}
              {demoUserBadges.map((badge) => (
                <Badge key={badge.id} variant="secondary" className="bg-card/70 hover:bg-card/90 text-foreground border-whirl-blue-dark">
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <TokenPurchaseOptions />
          </div>
          
          <Tabs defaultValue="videos" className="mb-8">
            <TabsList className="grid grid-cols-2 mb-6 mx-auto max-w-md bg-background/50 border border-whirl-blue-dark">
              <TabsTrigger value="videos" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">My Videos</TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">My Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              {videosLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-48 w-full bg-slate-700" />
                      <Skeleton className="h-4 w-3/4 bg-slate-700" />
                      <Skeleton className="h-4 w-1/2 bg-slate-700" />
                    </div>
                  ))}
                </div>
              )}
              {videosError && (
                 <div className="text-center py-12 text-red-400">
                  <p>Error loading videos. Please try again.</p>
                </div>
              )}
              {!videosLoading && !videosError && userVideos && userVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userVideos.map((dbVideo: DbVideo) => {
                    // Transform dbVideo to the format expected by VideoCard
                    const cardVideo: VideoCardVideo = {
                      id: dbVideo.id,
                      title: dbVideo.title,
                      url: dbVideo.video_url,
                      thumbnail: dbVideo.thumbnail_url || '/placeholder.svg', 
                      userId: dbVideo.user_id,
                      category: (dbVideo.category && categories.includes(dbVideo.category as Category)) 
                                ? dbVideo.category as Category 
                                : categories[0], // Default to first category if invalid or null
                      likes: 0, // Default 'likes' as it's not in DbVideo
                      createdAt: dbVideo.created_at,
                    };
                    return <VideoCard key={dbVideo.id} video={cardVideo} />;
                  })}
                </div>
              ) : (
                !videosLoading && !videosError && (
                  <div className="text-center py-12">
                    <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No videos uploaded yet. Start by uploading your first masterpiece!
                    </p>
                  </div>
                )
              )}
            </TabsContent>
            
            <TabsContent value="badges">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* TODO: Fetch badges for the authenticated user */}
                {demoUserBadges.map((badge) => (
                  <div key={badge.id} className="p-4 bg-card/70 rounded-lg flex items-center border border-whirl-blue-dark">
                    <div className="text-4xl mr-3">{badge.icon}</div>
                    <div>
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
                 {demoUserBadges.length === 0 && (
                   <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground">No badges earned yet. Keep battling!</p>
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

export default ProfilePage;
