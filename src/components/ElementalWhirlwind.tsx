
import React, { useState, useCallback } from 'react';

interface ElementBoost {
  ice: boolean;
  fire: boolean;
  earth: boolean;
  water: boolean;
  electricity: boolean;
}

const ElementalWhirlwind: React.FC = () => {
  const [boostedElements, setBoostedElements] = useState<ElementBoost>({
    ice: false,
    fire: false,
    earth: false,
    water: false,
    electricity: false
  });

  const handleElementTouch = useCallback((elementType: keyof ElementBoost) => {
    setBoostedElements(prev => ({ ...prev, [elementType]: true }));
    
    // Reset boost after 6 seconds
    setTimeout(() => {
      setBoostedElements(prev => ({ ...prev, [elementType]: false }));
    }, 6000);
  }, []);

  const getElementAnimation = (elementType: keyof ElementBoost, baseAnimation: string) => {
    if (boostedElements[elementType]) {
      return baseAnimation.replace(/\d+s/g, (match) => {
        const seconds = parseInt(match);
        return `${Math.max(2, seconds / 4)}s`; // Speed up by 4x, minimum 2s
      });
    }
    return baseAnimation;
  };

  const getElementStyle = (elementType: keyof ElementBoost, baseStyle: React.CSSProperties) => {
    const isBoosted = boostedElements[elementType];
    return {
      ...baseStyle,
      transform: isBoosted ? 'scale(1.2)' : 'scale(1)',
      filter: isBoosted ? 'brightness(1.5) blur(1px)' : 'brightness(1)',
      transition: 'transform 0.3s ease, filter 0.3s ease',
      cursor: 'pointer'
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ice Element - Blue/White swirl */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-20 ice-element pointer-events-auto"
        style={getElementStyle('ice', {
          background: 'radial-gradient(circle, rgba(173,216,230,0.8) 0%, rgba(135,206,235,0.4) 50%, transparent 100%)',
          animation: `${getElementAnimation('ice', 'iceSweep 15s linear infinite')}, pulse 3s ease-in-out infinite`
        })}
        onMouseDown={() => handleElementTouch('ice')}
        onTouchStart={() => handleElementTouch('ice')}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-400/30 animate-pulse"></div>
        {boostedElements.ice && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/50 to-blue-500/50 animate-pulse"></div>
        )}
      </div>

      {/* Fire Element - Red/Orange swirl */}
      <div 
        className="absolute w-40 h-40 rounded-full opacity-25 fire-element pointer-events-auto"
        style={getElementStyle('fire', {
          background: 'radial-gradient(circle, rgba(255,69,0,0.8) 0%, rgba(255,140,0,0.4) 50%, transparent 100%)',
          animation: `${getElementAnimation('fire', 'fireSweep 12s linear infinite')}, flicker 2s ease-in-out infinite`
        })}
        onMouseDown={() => handleElementTouch('fire')}
        onTouchStart={() => handleElementTouch('fire')}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/40 to-orange-600/40 animate-pulse"></div>
        {boostedElements.fire && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600/60 to-orange-700/60 animate-pulse"></div>
        )}
      </div>

      {/* Earth Element - Brown/Green swirl */}
      <div 
        className="absolute w-36 h-36 rounded-full opacity-20 earth-element pointer-events-auto"
        style={getElementStyle('earth', {
          background: 'radial-gradient(circle, rgba(139,69,19,0.8) 0%, rgba(34,139,34,0.4) 50%, transparent 100%)',
          animation: `${getElementAnimation('earth', 'earthSweep 18s linear infinite')}, earthPulse 4s ease-in-out infinite`
        })}
        onMouseDown={() => handleElementTouch('earth')}
        onTouchStart={() => handleElementTouch('earth')}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-800/30 to-green-700/30 animate-pulse"></div>
        {boostedElements.earth && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/50 to-green-800/50 animate-pulse"></div>
        )}
      </div>

      {/* Water Element - Blue swirl */}
      <div 
        className="absolute w-44 h-44 rounded-full opacity-20 water-element pointer-events-auto"
        style={getElementStyle('water', {
          background: 'radial-gradient(circle, rgba(0,191,255,0.8) 0%, rgba(30,144,255,0.4) 50%, transparent 100%)',
          animation: `${getElementAnimation('water', 'waterSweep 14s linear infinite')}, wave 3.5s ease-in-out infinite`
        })}
        onMouseDown={() => handleElementTouch('water')}
        onTouchStart={() => handleElementTouch('water')}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-600/40 animate-pulse"></div>
        {boostedElements.water && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/60 to-cyan-700/60 animate-pulse"></div>
        )}
      </div>

      {/* Electricity Element - Yellow/Purple swirl */}
      <div 
        className="absolute w-40 h-40 rounded-full opacity-30 electricity-element pointer-events-auto"
        style={getElementStyle('electricity', {
          background: 'radial-gradient(circle, rgba(255,255,0,0.9) 0%, rgba(138,43,226,0.5) 50%, transparent 100%)',
          animation: `${getElementAnimation('electricity', 'electricitySweep 10s linear infinite')}, electric 1.5s ease-in-out infinite`
        })}
        onMouseDown={() => handleElementTouch('electricity')}
        onTouchStart={() => handleElementTouch('electricity')}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400/50 to-purple-600/50 animate-pulse"></div>
        {boostedElements.electricity && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/70 to-purple-700/70 animate-pulse"></div>
        )}
      </div>

      {/* Central whirlwind vortex */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-spin"></div>
      </div>
    </div>
  );
};

export default ElementalWhirlwind;
