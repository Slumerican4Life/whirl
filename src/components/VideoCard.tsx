
import { Video, getUser } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const user = getUser(video.userId);
  
  if (!user) return null;
  
  return (
    <Link to={`/video/${video.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 bg-card">
        <div className="relative">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="aspect-video object-cover w-full"
          />
          <Badge className="absolute top-2 right-2 bg-whirl-purple hover:bg-whirl-purple">
            {video.category}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-md mb-2 line-clamp-1">{video.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{user.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">❤️ {video.likes}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default VideoCard;
