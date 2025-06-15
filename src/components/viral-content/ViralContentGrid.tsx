
import React from 'react';
import ViralContentCard from './ViralContentCard';
import { ViralContent } from '@/lib/viral-content-queries';

interface ViralContentGridProps {
  viralContent: ViralContent[];
  onVideoClick: (videoUrl: string) => void;
  onVote: (contentId: string, e: React.MouseEvent) => void;
}

const ViralContentGrid: React.FC<ViralContentGridProps> = ({
  viralContent,
  onVideoClick,
  onVote
}) => {
  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-gray-400">
          🔥 <span className="text-red-400 font-semibold">{viralContent.length} viral videos</span> from TikTok, YouTube, Instagram & Facebook
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {viralContent.map((content) => (
          <ViralContentCard
            key={content.id}
            content={content}
            onVideoClick={onVideoClick}
            onVote={onVote}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Click any video to watch on the original platform • Vote for your favorites!
        </p>
      </div>
    </>
  );
};

export default ViralContentGrid;
