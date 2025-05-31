
import { useState, useEffect } from "react";
import { Category } from "@/lib/data";
import { Battle } from "@/lib/battle-queries";
import NavBar from "@/components/NavBar";
import AdSenseUnit from "@/components/AdSenseUnit";
import TokenCTA from "@/components/TokenCTA";
import LoadingSpinner from "@/components/LoadingSpinner";
import HeroSection from "@/components/page-specific/index/HeroSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";
import ElementalWhirlwind from "@/components/ElementalWhirlwind";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveBattles, getBattlesByCategory } from "@/lib/battle-queries";

const ADS_CLIENT_ID = "ca-pub-5650237599652350";

const Index = () => {
  const { user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [slumericanBattles, setSlumericanBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate minimum loading time for better UX
        const startTime = Date.now();
        
        const allActiveBattles = await getActiveBattles();
        
        if (selectedCategory !== 'All') {
          setActiveBattles(allActiveBattles.filter(battle => battle.category === selectedCategory));
        } else {
          setActiveBattles(allActiveBattles);
        }

        const slumericanBattlesData = await getBattlesByCategory('Slumerican');
        setSlumericanBattles(slumericanBattlesData.filter(battle => battle.status === 'active'));
        
        // Ensure minimum loading time for smooth experience
        const elapsedTime = Date.now() - startTime;
        const minLoadTime = 800;
        
        if (elapsedTime < minLoadTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
        }
        
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading battles:', error);
        setDataLoaded(true); // Still show content even if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen swirl-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-6 text-xl font-medium animate-pulse">
            Loading epic battles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg text-white relative">
      {/* Animated Elemental Whirlwind Background */}
      <ElementalWhirlwind />
      
      <NavBar />
      
      {/* Header Ad Banner */}
      <div className="container mx-auto px-4 py-2 text-center relative z-10">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="6714233499"
          format="auto"
          responsive="true"
          comment="slumbucket-homepage-header-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>

      <div className="container mx-auto px-0 md:px-4 py-6 flex flex-col md:flex-row md:space-x-4 relative z-10">
        {/* Left Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2 md:p-4">
          <div className="sticky top-20">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="7994098522"
              format="auto"
              responsive="true"
              comment="slumbucket-homepage-left-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full md:w-1/2 lg:w-3/5 xl:w-2/3 px-4 md:px-0">
          <div className={`transition-opacity duration-500 ${dataLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <HeroSection />
            
            {user && <TokenCTA />}

            <SlumericanCornerSection battles={slumericanBattles} />

            {/* Multiplex Ad */}
            <section className="my-8 text-center">
              <AdSenseUnit
                client={ADS_CLIENT_ID}
                slot="8238475251"
                format="autorelaxed"
                comment="slumbucket-homepage-multiplex"
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
                comment="slumbucket-homepage-mobile-content"
                className="min-h-[200px]"
              />
            </div>

            <TodaysBattlesSection 
              activeBattles={activeBattles}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </main>

        {/* Right Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2 md:p-4">
           <div className="sticky top-20">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8430046943"
              format="auto"
              responsive="true"
              comment="slumbucket-homepage-right-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>
      </div>
      
      {/* Footer Ad Banner */}
      <div className="container mx-auto px-4 py-2 mt-8 text-center relative z-10">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="5424609655"
          format="auto"
          responsive="true"
          comment="slumbucket-homepage-footer-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>
    </div>
  );
};

export default Index;
