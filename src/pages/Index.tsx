
import HeroSection from "@/components/page-specific/index/HeroSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import ViralContentSection from "@/components/ViralContentSection";
import TruthSectionPreview from "@/components/TruthSectionPreview";
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
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      <TodaysBattlesSection />
      <ViralContentSection />
      <TruthSectionPreview />
      <SlumericanCornerSection battles={slumericanBattles} />
    </div>
  );
};

export default Index;
