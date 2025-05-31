
import React from 'react';
import { Category } from '@/lib/data';
import { Battle } from '@/lib/battle-queries';
import BattleCard from '@/components/BattleCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Swords, TrendingUp } from 'lucide-react';

interface TodaysBattlesSectionProps {
  activeBattles: Battle[];
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const TodaysBattlesSection: React.FC<TodaysBattlesSectionProps> = ({ 
  activeBattles, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-whirl-purple to-whirl-pink p-3 rounded-2xl shadow-lg">
            <Swords className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Today's Battles</h2>
            <p className="text-gray-400 mt-1">Live competitions happening now</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">{activeBattles.length} Active</span>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>
      
      {/* Battles Content */}
      {activeBattles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {activeBattles.map((battle) => (
            <div key={battle.id} className="transform transition-all hover:scale-[1.02]">
              <BattleCard battle={battle} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass-dark rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Swords className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No Active Battles</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              No battles in this category right now.
              <br />
              Be the first to start the action!
            </p>
            <button className="bg-gradient-to-r from-whirl-purple to-whirl-pink text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
              Upload Video
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TodaysBattlesSection;
