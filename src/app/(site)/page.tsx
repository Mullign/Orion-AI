import { FeaturesSection } from "@/components/site/FeaturesSection";
import { GetStartedSection } from "@/components/site/GetStartedSection";
import { HeroSection } from "@/components/site/HeroSection";
import { OriginSection } from "@/components/site/OriginSection";
import { PreviewSection } from "@/components/site/PreviewSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { SetupTerminalSection } from "@/components/site/SetupTerminalSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ReviewsSection />
      <SetupTerminalSection />
      <PreviewSection />
      <OriginSection />
      <GetStartedSection />
    </>
  );
}
