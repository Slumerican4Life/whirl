
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Trophy, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="mb-12 relative">
      {/* Hero Content */}
      <div className="flex flex-col items-center text-center mb-12 relative z-10">
        {/* Main Title with Enhanced Styling */}
        <div className="relative mb-6">
          <h1 className="text-6xl md:text-8xl font-black mb-4 gradient-text tracking-tight">
            WHIRL-WIN
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 gradient-text text-6xl md:text-8xl font-black">
            WHIRL-WIN
          </div>
        </div>
        
        {/* Subtitle with modern styling */}
        <div className="glass-dark rounded-2xl px-8 py-4 mb-8 max-w-2xl">
          <p className="text-xl md:text-2xl text-gray-100 font-medium leading-relaxed">
            <span className="text-whirl-purple font-bold">60-second</span> video battles.
            <br />
            <span className="text-whirl-pink font-bold">Vote</span>, 
            <span className="text-whirl-orange font-bold"> win</span>, 
            <span className="text-whirl-blue font-bold"> dominate</span>.
          </p>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Link to="/upload" className="relative group">
            <button className="btn-glow bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl flex items-center gap-3">
              <Play className="w-6 h-6" />
              Upload & Battle
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </Link>
          
          <Link to="/leaderboard" className="relative group">
            <button className="glass border-2 border-whirl-purple text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:bg-whirl-purple/20 flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              View Leaderboard
            </button>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
          <div className="modern-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-whirl-purple to-whirl-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Instant Battles</h3>
            <p className="text-gray-400 text-sm">Upload and compete in real-time video battles</p>
          </div>
          
          <div className="modern-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-whirl-orange to-whirl-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Win Rewards</h3>
            <p className="text-gray-400 text-sm">Climb the leaderboard and earn recognition</p>
          </div>
          
          <div className="modern-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-whirl-blue to-whirl-violet rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">60 Seconds</h3>
            <p className="text-gray-400 text-sm">Quick, engaging battles that pack a punch</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
