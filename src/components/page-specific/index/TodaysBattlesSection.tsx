
import React from 'react';
import { Category } from '@/lib/data';
import { Battle, getBattlesByType } from '@/lib/battle-queries';
import BattleCard from '@/components/BattleCard';
import CategoryFilter from '@/components/CategoryFilter';
import AdSenseUnit from '@/components/AdSenseUnit';
import { Swords, TrendingUp, User, Bot, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [humanBattles, setHumanBattles] = useState<Battle[]>([]);
  const [aiBattles, setAiBattles] = useState<Battle[]>([]);
  const [hybridBattles, setHybridBattles] = useState<Battle[]>([]);

  useEffect(() => {
    const loadBattlesByType = async () => {
      const [human, ai, hybrid] = await Promise.all([
        getBattlesByType('human_vs_human'),
        getBattlesByType('ai_vs_ai'),
        getBattlesByType('human_vs_ai')
      ]);
      
      // Filter by category if selected
      const filterByCategory = (battles: Battle[]) => {
        if (selectedCategory === 'All') return battles;
        return battles.filter(battle => battle.category === selectedCategory);
      };

      setHumanBattles(filterByCategory(human));
      setAiBattles(filterByCategory(ai));
      setHybridBattles(filterByCategory(hybrid));
    };

    loadBattlesByType();
  }, [selectedCategory]);

  const BattleSection = ({ 
    title, 
    battles, 
    icon, 
    description, 
    gradient 
  }: { 
    title: string;
    battles: Battle[];
    icon: React.ReactNode;
    description: string;
    gradient: string;
  }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`${gradient} p-3 rounded-2xl shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 glass-dark px-3 py-1 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">{battles.length} Active</span>
        </div>
      </div>
      
      {battles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {battles.map((battle) => (
            <div key={battle.id} className="transform transition-all hover:scale-[1.02]">
              <BattleCard battle={battle} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="glass-dark rounded-2xl p-8 border border-white/10 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No Active Battles</h4>
            <p className="text-gray-400 text-sm">No {title.toLowerCase()} battles in this category right now.</p>
          </div>
        </div>
      )}
    </div>
  );

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
            <p className="text-gray-400 mt-1">Fair competitions across all skill levels</p>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>
      
      {/* Human vs Human Battles */}
      <BattleSection
        title="Human vs Human"
        battles={humanBattles}
        icon={<User className="w-8 h-8 text-white" />}
        description="Pure human creativity and skill"
        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
      />

      {/* Ad between sections */}
      <div className="my-8 text-center">
        <AdSenseUnit
          client="ca-pub-5650237599652350"
          slot="8238475251"
          format="autorelaxed"
          comment="battles-section-divider"
          className="min-h-[200px]"
        />
      </div>

      {/* AI vs AI Battles */}
      <BattleSection
        title="AI vs AI"
        battles={aiBattles}
        icon={<Bot className="w-8 h-8 text-white" />}
        description="Cutting-edge AI creativity showcase"
        gradient="bg-gradient-to-br from-purple-500 to-purple-600"
      />

      {/* Ad between sections */}
      <div className="my-8 text-center">
        <AdSenseUnit
          client="ca-pub-5650237599652350"
          slot="7994098522"
          format="auto"
          responsive="true"
          comment="battles-section-divider-2"
          className="min-h-[200px]"
        />
      </div>

      {/* Human vs AI Battles - The Underdog Section */}
      <BattleSection
        title="Human vs AI - Underdog Battles"
        battles={hybridBattles}
        icon={<Zap className="w-8 h-8 text-white" />}
        description="🥊 Humans get the underdog advantage!"
        gradient="bg-gradient-to-br from-orange-500 to-red-500"
      />
    </section>
  );
};

export default TodaysBattlesSection;
