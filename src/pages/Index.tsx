
import { useState, useEffect } from "react";
import { categories, Category, getActiveBattles, Battle } from "@/lib/data";
import NavBar from "@/components/NavBar";
import BattleCard from "@/components/BattleCard";
import CategoryFilter from "@/components/CategoryFilter";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);

  useEffect(() => {
    // Get all active battles
    const battles = getActiveBattles();
    
    // Filter battles by category if a category is selected
    if (selectedCategory !== 'All') {
      setActiveBattles(battles.filter(battle => battle.category === selectedCategory));
    } else {
      setActiveBattles(battles);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange text-transparent bg-clip-text">
              WHIRL
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              15-second video battles. Vote, win, dominate.
            </p>
            <div className="flex space-x-4">
              <a href="/upload" className="animate-pulse-glow rounded-md">
                <button className="bg-whirl-purple hover:bg-whirl-deep-purple text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105">
                  Upload & Battle
                </button>
              </a>
              <a href="/leaderboard">
                <button className="bg-transparent border border-whirl-purple text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105">
                  View Leaderboard
                </button>
              </a>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Today's Battles</h2>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
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
      </main>
    </div>
  );
};

export default Index;
