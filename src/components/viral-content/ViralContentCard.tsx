
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, ThumbsUp } from 'lucide-react';
import { ViralContent } from '@/lib/viral-content-queries';

interface ViralContentCardProps {
  content: ViralContent;
  onVideoClick: (videoUrl: string) => void;
  onVote: (contentId: string, e: React.MouseEvent) => void;
}

const ViralContentCard: React.FC<ViralContentCardProps> = ({
  content,
  onVideoClick,
  onVote
}) => {
  const formatViews = (views?: number) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return 'bg-black text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'youtube': return 'bg-red-600 text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card 
      className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-red-500 transition-all cursor-pointer hover:scale-105"
      onClick={() => onVideoClick(content.video_url)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          <img 
            src={content.thumbnail_url || '/placeholder.svg'} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Play className="h-8 w-8 text-white" />
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
          </div>
          <Badge className={`absolute top-2 left-2 ${getPlatformColor(content.platform)}`}>
            {content.platform.toUpperCase()}
          </Badge>
          {content.engagement_score && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              🔥 {content.engagement_score}%
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-2">
            {content.title}
          </h3>
          {content.description && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {content.description}
            </p>
          )}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>{formatViews(content.view_count)} views</span>
            <span>{new Date(content.fetched_at).toLocaleDateString()}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={(e) => onVote(content.id, e)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Vote for this!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViralContentCard;
