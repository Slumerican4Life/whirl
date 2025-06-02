
import React from 'react';
import { Link } from 'react-router-dom';
import { Battle } from '@/lib/battle-queries';
import BattleCard from '@/components/BattleCard';
import { Button } from '@/components/ui/button';
import { Crown, Flame } from 'lucide-react';

interface SlumericanCornerSectionProps {
  battles: Battle[];
}

const SlumericanCornerSection: React.FC<SlumericanCornerSectionProps> = ({ battles }) => {
  console.log('SlumericanCornerSection battles:', battles);
  
  return (
    <section className="mb-16 relative container mx-auto px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-whirl-slumerican-black to-black rounded-3xl opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-whirl-slumerican-red/20 via-transparent to-whirl-slumerican-gold/20 rounded-3xl"></div>
      
      {/* Content */}
      <div className="relative glass-dark p-8 rounded-3xl border border-whirl-slumerican-red/30 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-whirl-slumerican-red to-whirl-slumerican-gold p-3 rounded-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <Flame className="absolute -top-1 -right-1 w-5 h-5 text-orange-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">
                <span className="bg-gradient-to-r from-whirl-slumerican-red via-whirl-slumerican-gold to-white text-transparent bg-clip-text">
                  SLUMERICAN CORNER
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold rounded-full"></div>
            </div>
          </div>
          
          <Link to="/slumerican">
            <Button className="bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold text-white hover:from-whirl-slumerican-gold hover:to-whirl-slumerican-red font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
              <Flame className="w-4 h-4 mr-2" />
              Explore Slumerican
            </Button>
          </Link>
        </div>
        
        {/* Description */}
        <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
          <p className="text-gray-200 text-lg leading-relaxed">
            Dedicated to <span className="text-whirl-slumerican-gold font-bold">Yelawolf</span> and the 
            <span className="text-whirl-slumerican-red font-bold"> Slumerican culture</span>. 
            Raw, authentic, and straight from the streets.
          </p>
        </div>
        
        {/* Always show content - either battles or call to action */}
        {battles && battles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {battles.map((battle) => (
              <div key={battle.id} className="transform transition-all hover:scale-[1.02]">
                <BattleCard battle={battle} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/30 rounded-lg border border-whirl-slumerican-red/20">
            <div className="mb-4">
              <Crown className="w-16 h-16 text-whirl-slumerican-gold mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold text-transparent bg-clip-text">
                Slumerican Battles Coming Soon
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Be the first to drop your Slumerican content and represent the culture!
            </p>
            <Link to="/upload" className="inline-block">
              <Button className="bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold hover:from-whirl-slumerican-gold hover:to-whirl-slumerican-red font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-lg">
                <Flame className="w-5 h-5 mr-2" />
                Submit Slumerican Video
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SlumericanCornerSection;
