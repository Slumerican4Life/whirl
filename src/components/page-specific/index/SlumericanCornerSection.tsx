
import React from 'react';
import { Link } from 'react-router-dom';
import { Battle } from '@/lib/data';
import BattleCard from '@/components/BattleCard';
import { Button } from '@/components/ui/button';

interface SlumericanCornerSectionProps {
  battles: Battle[];
}

const SlumericanCornerSection: React.FC<SlumericanCornerSectionProps> = ({ battles }) => {
  if (battles.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 p-6 rounded-lg bg-gradient-to-r from-black to-whirl-dark border border-whirl-red">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-whirl-red via-whirl-orange to-whirl-purple text-transparent bg-clip-text">
            Slumerican Corner
          </span>
        </h2>
        <Link to="/slumerican">
          <Button variant="outline" className="border-whirl-red text-white hover:bg-whirl-red">
            Explore Slumerican
          </Button>
        </Link>
      </div>
      
      <p className="text-gray-300 mb-6">
        Dedicated to Yelawolf and the Slumerican culture. Raw, authentic, and straight from the streets.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {battles.map((battle) => (
          <BattleCard key={battle.id} battle={battle} />
        ))}
      </div>
    </section>
  );
};

export default SlumericanCornerSection;

