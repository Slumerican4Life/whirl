
import HeroSection from "@/components/page-specific/index/HeroSection";
import BattleArenaSection from "@/components/page-specific/index/BattleArenaSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import ViralContentSection from "@/components/ViralContentSection";
import TruthSectionPreview from "@/components/TruthSectionPreview";
import ElementalWhirlwind from "@/components/ElementalWhirlwind";
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

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Animated Background */}
      <ElementalWhirlwind />
      
      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <BattleArenaSection />
        <TodaysBattlesSection />
        <ViralContentSection />
        <TruthSectionPreview />
        <SlumericanCornerSection battles={slumericanBattles} />
      </div>
    </div>
  );
};

export default Index;
