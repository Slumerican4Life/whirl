
import { useState, useEffect } from "react";
import { Category, getActiveBattles, Battle, getBattlesByCategory } from "@/lib/data";
import NavBar from "@/components/NavBar";
import AdSenseUnit from "@/components/AdSenseUnit";
import HeroSection from "@/components/page-specific/index/HeroSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";

const ADS_CLIENT_ID = "ca-pub-5650237599652350";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [slumericanBattles, setSlumericanBattles] = useState<Battle[]>([]);

  useEffect(() => {
    const allActiveBattles = getActiveBattles();
    
    if (selectedCategory !== 'All') {
      setActiveBattles(allActiveBattles.filter(battle => battle.category === selectedCategory));
    } else {
      setActiveBattles(allActiveBattles);
    }

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
          <div className="sticky top-20">
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
          <HeroSection />
          
          <SlumericanCornerSection battles={slumericanBattles} />

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

          <TodaysBattlesSection 
            activeBattles={activeBattles}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </main>

        {/* Right Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2 md:p-4">
           <div className="sticky top-20">
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

