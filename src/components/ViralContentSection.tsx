import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { getViralContent, fetchNewViralContent } from '@/lib/viral-content';
import LoadingFallback from '@/components/LoadingFallback';
import ViralContentHeader from '@/components/viral-content/ViralContentHeader';
import ViralContentGrid from '@/components/viral-content/ViralContentGrid';

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
        <ViralContentHeader onRefresh={handleRefresh} />

        {!viralContent || viralContent.length === 0 ? (
          <LoadingFallback 
            title="No Viral Content Available"
            description="New trending content will appear here soon"
            onRetry={handleRefresh}
          />
        ) : (
          <ViralContentGrid
            viralContent={viralContent}
            onVideoClick={handleVideoClick}
            onVote={handleVote}
          />
        )}
      </div>
    </section>
  );
};

export default ViralContentSection;
