
import HeroSection from "@/components/page-specific/index/HeroSection";
import BattleArenaSection from "@/components/page-specific/index/BattleArenaSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import ViralContentSection from "@/components/ViralContentSection";
import TruthSectionPreview from "@/components/TruthSectionPreview";
import ElementalWhirlwind from "@/components/ElementalWhirlwind";
import AdSenseUnit from "@/components/AdSenseUnit";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useQuery } from "@tanstack/react-query";
import { getBattlesByCategory } from "@/lib/battle-queries";

const Index = () => {
  const { user } = useRequireAuth();

  // Fetch Slumerican battles for the corner section
  const { data: slumericanBattles = [] } = useQuery({
    queryKey: ['slumerican-battles'],
    queryFn: () => getBattlesByCategory('slumerican'),
  });

  console.log('Slumerican battles:', slumericanBattles);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Animated Background */}
      <ElementalWhirlwind />
      
      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        
        {/* Ad after Hero */}
        <div className="container mx-auto px-4 py-4">
          <AdSenseUnit
            client="ca-pub-5650237599652350"
            slot="8238475251"
            format="auto"
            responsive="true"
            comment="homepage-hero-banner"
            className="min-h-[100px] block w-full"
          />
        </div>
        
        <BattleArenaSection />
        
        {/* Ad after Battle Arena */}
        <div className="container mx-auto px-4 py-4">
          <AdSenseUnit
            client="ca-pub-5650237599652350"
            slot="7394728495"
            format="auto"
            responsive="true"
            comment="homepage-battle-banner"
            className="min-h-[100px] block w-full"
          />
        </div>
        
        <TodaysBattlesSection />
        
        <ViralContentSection />
        
        {/* Ad after Viral Content */}
        <div className="container mx-auto px-4 py-4">
          <AdSenseUnit
            client="ca-pub-5650237599652350"
            slot="6183950742"
            format="auto"
            responsive="true"
            comment="homepage-viral-banner"
            className="min-h-[100px] block w-full"
          />
        </div>
        
        <TruthSectionPreview />
        
        <SlumericanCornerSection battles={slumericanBattles} />
        
        {/* Final Ad */}
        <div className="container mx-auto px-4 py-8">
          <AdSenseUnit
            client="ca-pub-5650237599652350"
            slot="5072173989"
            format="auto"
            responsive="true"
            comment="homepage-footer-banner"
            className="min-h-[100px] block w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
