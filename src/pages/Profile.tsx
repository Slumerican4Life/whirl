
import { users, getUser } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/lib/data";

const ProfilePage = () => {
  // Use the first user for now
  const user = users[0];
  
  // Get videos for this user
  const userVideos = videos.filter(video => video.userId === user.id);
  
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-4 relative">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="rounded-full border-4 border-whirl-purple animate-pulse-glow"
              />
              <div className="absolute -bottom-2 -right-2 bg-whirl-purple text-white rounded-full px-2 py-1 text-xs font-semibold">
                {user.wins} Wins
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.username}</h1>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {user.badges.map((badge) => (
                <Badge key={badge.id} className="bg-card/70 hover:bg-card/70 text-foreground">
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
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
                {user.badges.map((badge) => (
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
