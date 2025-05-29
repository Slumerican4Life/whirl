
import { Video, getUser } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const user = getUser(video.userId);
  const [likes, setLikes] = useState(video.likes || 0);
  const [dislikes, setDislikes] = useState(video.dislikes || 0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  
  if (!user) return null;

  const handleVote = (voteType: 'like' | 'dislike') => {
    if (userVote === voteType) {
      // Remove vote
      if (voteType === 'like') {
        setLikes(prev => prev - 1);
      } else {
        setDislikes(prev => prev - 1);
      }
      setUserVote(null);
      toast.success("Vote removed");
    } else {
      // Add or change vote
      if (userVote) {
        // Changing vote
        if (userVote === 'like') {
          setLikes(prev => prev - 1);
          setDislikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev - 1);
          setLikes(prev => prev + 1);
        }
      } else {
        // New vote
        if (voteType === 'like') {
          setLikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev + 1);
        }
      }
      setUserVote(voteType);
      toast.success(`${voteType === 'like' ? 'Liked' : 'Disliked'}!`);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 bg-card">
      <Link to={`/video/${video.id}`}>
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
      </Link>
      
      <div className="p-4">
        <Link to={`/video/${video.id}`}>
          <h3 className="font-semibold text-md mb-2 line-clamp-1 hover:text-whirl-purple transition-colors">
            {video.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">{user.username}</span>
          </div>
        </div>
        
        {/* Voting and Comments Section */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('like')}
              className={`text-xs px-2 ${userVote === 'like' ? 'text-green-500 bg-green-50' : 'text-gray-500'}`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('dislike')}
              className={`text-xs px-2 ${userVote === 'dislike' ? 'text-red-500 bg-red-50' : 'text-gray-500'}`}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              {dislikes}
            </Button>
          </div>
          
          <Link to={`/video/${video.id}#comments`}>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500">
              <MessageCircle className="w-3 h-3 mr-1" />
              {video.comments || 0}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
