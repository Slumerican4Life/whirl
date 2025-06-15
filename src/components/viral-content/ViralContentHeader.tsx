
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface ViralContentHeaderProps {
  onRefresh: () => void;
}

const ViralContentHeader: React.FC<ViralContentHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-red-500" />
        <h2 className="text-3xl font-bold text-white">Viral Feed</h2>
        <Badge variant="secondary" className="bg-red-500/20 text-red-400">
          LIVE TRENDING
        </Badge>
      </div>
      <Button 
        onClick={onRefresh}
        variant="outline" 
        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Feed
      </Button>
    </div>
  );
};

export default ViralContentHeader;
