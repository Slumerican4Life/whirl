import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/VideoCard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import TokenPurchaseOptions from "@/components/TokenPurchaseOptions";
import TwoFactorSetup from "@/components/TwoFactorSetup";
import StripeConnectButton from "@/components/StripeConnectButton";
import { RoleManagementPanel } from "@/components/role-management";
import { useRole } from "@/hooks/useRole";
import { Coins, Film, Shield, DollarSign, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserVideos } from "@/lib/video-queries"; 
import type { Video as DbVideo } from "@/lib/types"; 
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/lib/data";
import { categories } from "@/lib/data";
import { getUserBadges, checkAndAwardBadges } from "@/lib/badge-queries";
import type { UserBadge } from "@/lib/badge-queries";

// Define the type expected by VideoCard
interface VideoCardVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  userId: string;
  category: Category;
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useRequireAuth();
  const { isOwner, isAdmin, loading: roleLoading } = useRole();
  
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [userStats, setUserStats] = useState({ wins: 0, losses: 0, battles: 0 });
  const [stripeConnected, setStripeConnected] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(true);
  
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
          const { data, error } = await supabase
            .from('token_wallets') 
            .select('balance')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
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
        setTokenBalance(null);
        setLoadingBalance(false);
      }
    };

    if (!authLoading) {
      fetchTokenBalance();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        setLoadingBadges(true);
        setLoadingStripe(true);
        try {
          // Fetch user badges
          const badges = await getUserBadges(user.id);
          setUserBadges(badges);

          // Fetch user stats
          const { data: stats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (stats) {
            setUserStats({
              wins: stats.total_wins || 0,
              losses: stats.total_losses || 0,
              battles: stats.battles_participated || 0
            });
          }

          // Fetch Stripe connection status
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_stripe_connected')
            .eq('id', user.id)
            .single();

          setStripeConnected(profile?.is_stripe_connected || false);

          // Check and award new badges based on current stats
          await checkAndAwardBadges(user.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoadingBadges(false);
          setLoadingStripe(false);
        }
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const handleStripeConnectionChange = async () => {
    if (user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_stripe_connected')
        .eq('id', user.id)
        .single();

      setStripeConnected(profile?.is_stripe_connected || false);
    }
  };

  if (authLoading || roleLoading || (user && (loadingBalance || videosLoading))) {
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
                {userStats.wins} Wins 
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-whirl-text-bright">
              {displayUsername}
            </h1>
            
            <div className="flex items-center gap-4 mb-3">
              {loadingBalance ? (
                <Skeleton className="h-6 w-24 bg-slate-700" />
              ) : tokenBalance !== null ? (
                <div className="flex items-center text-lg text-whirl-orange">
                  <Coins className="w-5 h-5 mr-2" />
                  <span>{tokenBalance} Tokens</span>
                </div>
              ) : null}
              
              <div className="text-sm text-gray-300">
                <span className="font-medium">{userStats.battles}</span> battles
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {loadingBadges ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 bg-slate-700" />
                  <Skeleton className="h-8 w-24 bg-slate-700" />
                </div>
              ) : userBadges.length > 0 ? (
                userBadges.slice(0, 4).map((badge) => (
                  <Badge key={badge.id} variant="secondary" className="bg-card/70 hover:bg-card/90 text-foreground border-whirl-blue-dark">
                    {badge.icon} {badge.name}
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-gray-400">
                  No badges earned yet - start battling!
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <TokenPurchaseOptions />
          </div>
          
          <Tabs defaultValue="videos" className="mb-8">
            <TabsList className={`grid ${isOwner || isAdmin ? 'grid-cols-5' : 'grid-cols-4'} mb-6 mx-auto max-w-lg bg-background/50 border border-whirl-blue-dark`}>
              <TabsTrigger value="videos" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">My Videos</TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">My Badges</TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-1" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-1" />
                Security
              </TabsTrigger>
              {(isOwner || isAdmin) && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-whirl-purple data-[state=active]:text-white">
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                </TabsTrigger>
              )}
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
                    const cardVideo: VideoCardVideo = {
                      id: dbVideo.id,
                      title: dbVideo.title,
                      url: dbVideo.video_url,
                      thumbnail: dbVideo.thumbnail_url || '/placeholder.svg', 
                      userId: dbVideo.user_id,
                      category: (dbVideo.category && categories.includes(dbVideo.category as Category)) 
                                ? dbVideo.category as Category 
                                : categories[0],
                      likes: 0,
                      dislikes: 0,
                      comments: 0,
                      timestamp: dbVideo.created_at,
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
                {loadingBadges ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-card/70 rounded-lg flex items-center border border-whirl-blue-dark">
                      <Skeleton className="w-12 h-12 rounded bg-slate-700 mr-3" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-slate-700" />
                        <Skeleton className="h-3 w-32 bg-slate-700" />
                      </div>
                    </div>
                  ))
                ) : userBadges.length > 0 ? (
                  userBadges.map((badge) => (
                    <div key={badge.id} className="p-4 bg-card/70 rounded-lg flex items-center border border-whirl-blue-dark">
                      <div className="text-4xl mr-3">{badge.icon}</div>
                      <div>
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Earned: {new Date(badge.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground">No badges earned yet. Keep battling!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-whirl-text-bright mb-2">Creator Earnings</h3>
                  <p className="text-gray-300 mb-6">
                    Connect your Stripe account to receive tips and battle winnings directly
                  </p>
                </div>

                <div className="flex justify-center">
                  {loadingStripe ? (
                    <Skeleton className="h-10 w-48 bg-slate-700" />
                  ) : (
                    <StripeConnectButton 
                      isConnected={stripeConnected}
                      onConnectionChange={handleStripeConnectionChange}
                    />
                  )}
                </div>

                <div className="bg-card/50 p-6 rounded-lg border border-whirl-blue-dark">
                  <h4 className="font-semibold mb-4 text-whirl-text-bright">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-whirl-orange">•</span>
                      <span>Receive 90% of all tips from your fans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-whirl-orange">•</span>
                      <span>Earn bonus tokens for winning battles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-whirl-orange">•</span>
                      <span>Payments processed securely through Stripe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-whirl-orange">•</span>
                      <span>Instant payouts to your connected bank account</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <TwoFactorSetup />
            </TabsContent>

            {(isOwner || isAdmin) && (
              <TabsContent value="admin">
                <RoleManagementPanel />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
