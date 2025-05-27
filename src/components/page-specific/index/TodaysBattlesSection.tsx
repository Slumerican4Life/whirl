
import React from 'react';
import { Battle, Category } from '@/lib/data';
import BattleCard from '@/components/BattleCard';
import CategoryFilter from '@/components/CategoryFilter';

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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Today's Battles</h2>
      </div>
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      
      {activeBattles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBattles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg">
          <p className="text-lg text-muted-foreground">
            No active battles in this category right now.
          </p>
          <p className="text-md text-muted-foreground">
            Check back later or upload your own video to start a battle!
          </p>
        </div>
      )}
    </section>
  );
};

export default TodaysBattlesSection;

