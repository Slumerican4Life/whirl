
import React from 'react';

const ElementalWhirlwind: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ice Element - Blue/White swirl */}
      <div className="absolute w-32 h-32 rounded-full opacity-20 ice-element"
           style={{
             background: 'radial-gradient(circle, rgba(173,216,230,0.8) 0%, rgba(135,206,235,0.4) 50%, transparent 100%)',
             animation: 'elementalSweep 15s linear infinite, pulse 3s ease-in-out infinite',
             animationDelay: '0s'
           }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-400/30 animate-pulse"></div>
      </div>

      {/* Fire Element - Red/Orange swirl */}
      <div className="absolute w-40 h-40 rounded-full opacity-25 fire-element"
           style={{
             background: 'radial-gradient(circle, rgba(255,69,0,0.8) 0%, rgba(255,140,0,0.4) 50%, transparent 100%)',
             animation: 'elementalSweep 12s linear infinite, flicker 2s ease-in-out infinite',
             animationDelay: '3s'
           }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/40 to-orange-600/40 animate-pulse"></div>
      </div>

      {/* Earth Element - Brown/Green swirl */}
      <div className="absolute w-36 h-36 rounded-full opacity-20 earth-element"
           style={{
             background: 'radial-gradient(circle, rgba(139,69,19,0.8) 0%, rgba(34,139,34,0.4) 50%, transparent 100%)',
             animation: 'elementalSweep 18s linear infinite, earthPulse 4s ease-in-out infinite',
             animationDelay: '6s'
           }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-800/30 to-green-700/30 animate-pulse"></div>
      </div>

      {/* Water Element - Blue swirl */}
      <div className="absolute w-44 h-44 rounded-full opacity-20 water-element"
           style={{
             background: 'radial-gradient(circle, rgba(0,191,255,0.8) 0%, rgba(30,144,255,0.4) 50%, transparent 100%)',
             animation: 'elementalSweep 14s linear infinite, wave 3.5s ease-in-out infinite',
             animationDelay: '9s'
           }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-600/40 animate-pulse"></div>
      </div>

      {/* Electricity Element - Yellow/Purple swirl - FIXED SIZING */}
      <div className="absolute w-40 h-40 rounded-full opacity-30 electricity-element"
           style={{
             background: 'radial-gradient(circle, rgba(255,255,0,0.9) 0%, rgba(138,43,226,0.5) 50%, transparent 100%)',
             animation: 'elementalSweep 10s linear infinite, electric 1.5s ease-in-out infinite',
             animationDelay: '12s'
           }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400/50 to-purple-600/50 animate-pulse"></div>
      </div>

      {/* Central whirlwind vortex - FIXED COLORS */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-spin"></div>
      </div>
    </div>
  );
};

export default ElementalWhirlwind;
