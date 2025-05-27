import { useState, useEffect } from "react";
import { categories, Category, getActiveBattles, Battle, getBattlesByCategory } from "@/lib/data";
import NavBar from "@/components/NavBar";
import BattleCard from "@/components/BattleCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AdSenseUnit from "@/components/AdSenseUnit"; // Import the AdSenseUnit component

const ADS_CLIENT_ID = "ca-pub-5650237599652350";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [slumericanBattles, setSlumericanBattles] = useState<Battle[]>([]);

  useEffect(() => {
    // Get all active battles
    const battles = getActiveBattles();
    
    // Filter battles by category if a category is selected
    if (selectedCategory !== 'All') {
      setActiveBattles(battles.filter(battle => battle.category === selectedCategory));
    } else {
      setActiveBattles(battles);
    }

    // Get Slumerican battles separately for the dedicated section
    setSlumericanBattles(getBattlesByCategory('Slumerican').filter(battle => battle.status === 'active'));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg text-white">
      <NavBar />
      
      {/* Header Ad Banner */}
      <div className="container mx-auto px-4 py-2 text-center">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="6714233499"
          format="auto"
          responsive="true"
          comment="ww-homepage-index-header-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>

      <div className="container mx-auto px-0 md:px-4 py-6 flex flex-col md:flex-row md:space-x-4">
        {/* Left Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2 md:p-4">
          <div className="sticky top-20"> {/* Adjust top value based on NavBar height */}
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="7994098522"
              format="auto"
              responsive="true"
              comment="ww-homepage-index-left-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full md:w-1/2 lg:w-3/5 xl:w-2/3 px-4 md:px-0">
          <section className="mb-8">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange text-transparent bg-clip-text">
                WHIRL-WIN
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
          
          {/* Slumerican Corner Section */}
          {slumericanBattles.length > 0 && (
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
                {slumericanBattles.map((battle) => (
                  <BattleCard key={battle.id} battle={battle} />
                ))}
              </div>
            </section>
          )}

          {/* Multiplex Ad */}
          <section className="my-8 text-center">
             <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8238475251"
              format="autorelaxed"
              comment="ww-homeppage-index-multiplex"
              className="min-h-[250px]"
            />
          </section>

          {/* Mobile In-Content Ad (Mobile Only) */}
          <div className="md:hidden my-4 text-center">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8716971498"
              format="fluid"
              layout="in-article"
              comment="ww-homepage-index-mobile-content"
              className="min-h-[200px]"
            />
          </div>

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

        {/* Right Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2 md:p-4">
           <div className="sticky top-20"> {/* Adjust top value based on NavBar height */}
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8430046943"
              format="auto"
              responsive="true"
              comment="ww-homepage-index-right-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>
      </div>
      
      {/* Footer Ad Banner */}
      <div className="container mx-auto px-4 py-2 mt-8 text-center">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="5424609655"
          format="auto"
          responsive="true"
          comment="ww-homepage-index-footer-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>
    </div>
  );
};

export default Index;
