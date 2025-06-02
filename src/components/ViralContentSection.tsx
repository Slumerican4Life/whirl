
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Play, ExternalLink, ThumbsUp } from 'lucide-react';
import { getViralContent, fetchNewViralContent } from '@/lib/viral-content-queries';
import LoadingFallback from '@/components/LoadingFallback';

const ViralContentSection = () => {
  const { data: viralContent, isLoading, refetch, error } = useQuery({
    queryKey: ['viral-content'],
    queryFn: getViralContent,
    staleTime: 2 * 60 * 1000, // 2 minutes - refresh more frequently for viral content
    retry: 2,
    retryDelay: 1000,
  });

  const handleRefresh = async () => {
    try {
      await fetchNewViralContent();
      refetch();
    } catch (error) {
      console.error('Failed to refresh viral content:', error);
    }
  };

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

  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const handleVote = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement voting functionality
    console.log('Vote for content:', contentId);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Viral Feed</h2>
            </div>
          </div>
          <LoadingFallback 
            title="Loading Viral Content"
            description="Fetching the hottest videos from TikTok, YouTube, Instagram & Facebook..."
            showRetry={false}
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Viral Feed</h2>
            </div>
          </div>
          <LoadingFallback 
            title="Unable to Load Viral Content"
            description="Check back soon for the latest trending videos from all platforms"
            onRetry={handleRefresh}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Viral Feed</h2>
            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
              LIVE TRENDING
            </Badge>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Feed
          </Button>
        </div>

        {!viralContent || viralContent.length === 0 ? (
          <LoadingFallback 
            title="No Viral Content Available"
            description="New trending content will appear here soon"
            onRetry={handleRefresh}
          />
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-400">
                🔥 <span className="text-red-400 font-semibold">{viralContent.length} viral videos</span> from TikTok, YouTube, Instagram & Facebook
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {viralContent.map((content) => (
                <Card 
                  key={content.id} 
                  className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-red-500 transition-all cursor-pointer hover:scale-105"
                  onClick={() => handleVideoClick(content.video_url)}
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
                        onClick={(e) => handleVote(content.id, e)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Vote for this!
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Click any video to watch on the original platform • Vote for your favorites!
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ViralContentSection;
