
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingFallbackProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  title,
  description = "Content is temporarily unavailable",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="text-center py-8 px-4">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default LoadingFallback;
