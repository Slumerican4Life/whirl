
import React, { useState, useEffect } from 'react';

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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Random Slumerican tips and game help messages
  const loadingTips = [
    "Creativity is your superpower - use it to transform your life 💪",
    "Stay authentic - your unique voice is your greatest asset 🎯",
    "14 years of growth taught me: consistency beats perfection ⭐",
    "Slumerican4Life - real recognizes real 🔥",
    "Every setback is a setup for a comeback 💥",
    "Upload videos under 60 seconds for epic battles ⚡",
    "Use tokens to vote for your favorite creators 🏆",
    "Support the community - we rise together 🤝",
    "Embrace the grind - resilience is your strength 💎",
    "Yelawolf inspired - authenticity over everything 🎤",
    "Keep growing, keep creating, keep pushing boundaries 🚀",
    "The Slumerican Corner awaits your talent 🎨",
    "From struggle to strength - that's the creator way ✨",
    "Build community, support others, stay humble 🙏",
    "Pro tip: Good lighting makes your videos pop! 💡",
    "Upload in landscape mode for better viewing experience 📱",
    "Clear audio is just as important as good visuals 🎧",
    "Practice your 60-second pitch before recording 🎬",
    "Vote with tokens to support creators you believe in 🪙",
    "Check the Slumerican Corner for authentic culture 🏠",
    "Engage with comments to build your fanbase 💬",
    "Study the leaderboard to see what works 📊",
    "Country boy with a mission - never forget your roots 🌾",
    "Slumerican way: Work hard, stay real, help others 💯",
    "Upload consistently to grow your following 📈",
    "Quality over quantity - make every second count ⏰"
  ];

  useEffect(() => {
    if (!showText) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 3000); // Change tip every 3 seconds

    return () => clearInterval(interval);
  }, [showText, loadingTips.length]);

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
        
        {/* Main Logo - Using actual logo instead of CSS creation */}
        <div className={`relative ${logoSizes[size]} bg-black rounded-full border-2 border-purple-500 flex items-center justify-center overflow-hidden animate-pulse`}>
          <img 
            src="/placeholder.svg" 
            alt="Whirl-Win Logo" 
            className="w-full h-full object-contain p-2"
          />
        </div>
      </div>

      {/* Branding Text */}
      {showText && (
        <div className="text-center">
          <h2 className={`font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 text-transparent bg-clip-text animate-pulse ${textSizes[size]}`}>
            Whirl-Win
          </h2>
          <p className={`text-gray-300 mb-4 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            powered by Slumbucket
          </p>
          
          {/* Random Inspirational Loading Tip */}
          <div className="max-w-md mx-auto">
            <p className={`text-center text-purple-200 font-medium transition-opacity duration-500 ${size === 'sm' ? 'text-xs' : 'text-sm'} px-4`}>
              {loadingTips[currentTipIndex]}
            </p>
          </div>
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
