
import React from 'react';

const ErrorBoundary = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center swirl-bg text-white">
      <div className="text-center p-8 max-w-md mx-4">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">
            We're sorry for the inconvenience. The page encountered an unexpected error.
          </p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleRetry}
            className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Try Again
          </button>
          <button 
            onClick={handleRefresh}
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
