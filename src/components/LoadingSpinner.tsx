
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true 
}) => {
  const containerSizes = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  const logoSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
      {/* Logo Container with Glow Effect */}
      <div className="relative mb-6">
        {/* Glow Background */}
        <div className={`absolute inset-0 ${logoSizes[size]} bg-purple-500/30 rounded-full blur-xl animate-pulse`}></div>
        
        {/* Main Logo */}
        <div className={`relative ${logoSizes[size]} bg-black rounded-full border-2 border-purple-500 flex items-center justify-center overflow-hidden animate-pulse`}>
          {/* Bucket Base */}
          <div className="absolute bottom-2 w-12 h-8 bg-gray-700 rounded-b-lg border-2 border-gray-600"></div>
          
          {/* Purple Fist */}
          <div className="relative z-10 w-8 h-10 bg-purple-500 rounded-lg transform -rotate-12 animate-bounce">
            {/* Fist Details */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 rounded"></div>
            <div className="absolute top-3 left-0.5 w-2 h-1 bg-purple-400 rounded"></div>
            <div className="absolute top-5 left-0.5 w-2 h-1 bg-purple-400 rounded"></div>
          </div>
          
          {/* Lightning Bolts */}
          <div className="absolute top-1 right-2 text-blue-400 text-lg animate-pulse">⚡</div>
          <div className="absolute top-3 left-1 text-blue-300 text-sm animate-pulse delay-300">⚡</div>
          <div className="absolute bottom-3 right-1 text-blue-500 text-xs animate-pulse delay-150">⚡</div>
        </div>
      </div>

      {/* Branding Text */}
      {showText && (
        <div className="text-center">
          <h2 className={`font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 text-transparent bg-clip-text animate-pulse ${textSizes[size]}`}>
            Whirl-Win
          </h2>
          <p className={`text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            powered by Slumbucket
          </p>
        </div>
      )}

      {/* Loading Animation Bars */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-8 bg-purple-500 rounded animate-pulse"></div>
        <div className="w-2 h-8 bg-blue-400 rounded animate-pulse delay-75"></div>
        <div className="w-2 h-8 bg-purple-400 rounded animate-pulse delay-150"></div>
        <div className="w-2 h-8 bg-blue-500 rounded animate-pulse delay-225"></div>
        <div className="w-2 h-8 bg-purple-600 rounded animate-pulse delay-300"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
