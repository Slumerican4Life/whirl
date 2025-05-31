
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Heart, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TipCreatorButton from "@/components/TipCreatorButton";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  userId: string;
  category: string;
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
}

interface VideoCardProps {
  video: Video;
  onPlay?: (videoId: string) => void;
  className?: string;
  showTipButton?: boolean;
}

const VideoCard = ({ video, onPlay, className = "", showTipButton = true }: VideoCardProps) => {
  const { user } = useRequireAuth();

  const handlePlay = () => {
    onPlay?.(video.id);
  };

  const timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });

  return (
    <Card className={`bg-background/70 border-whirl-blue-dark hover:bg-background/90 transition-all overflow-hidden ${className}`}>
      <div className="relative aspect-video bg-slate-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={handlePlay}
          >
            <Play className="w-6 h-6" />
          </Button>
        </div>
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-whirl-purple/80 text-white"
        >
          {video.category}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-whirl-text-bright line-clamp-2 hover:text-whirl-purple transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{timeAgo}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{video.dislikes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{video.comments}</span>
            </div>
          </div>
          
          {showTipButton && user && user.id !== video.userId && (
            <TipCreatorButton 
              creatorId={video.userId}
              creatorName="Creator"
              className="text-xs"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
