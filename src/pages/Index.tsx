
import HeroSection from "@/components/page-specific/index/HeroSection";
import TodaysBattlesSection from "@/components/page-specific/index/TodaysBattlesSection";
import SlumericanCornerSection from "@/components/page-specific/index/SlumericanCornerSection";
import ViralContentSection from "@/components/ViralContentSection";
import TruthSectionPreview from "@/components/TruthSectionPreview";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Index = () => {
  const { user } = useRequireAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      <TodaysBattlesSection />
      <ViralContentSection />
      <TruthSectionPreview />
      <SlumericanCornerSection />
    </div>
  );
};

export default Index;
