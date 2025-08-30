import {
  CTASection,
  CustomerSatisfactionSection,
  FooterSection,
  HeroSection,
  KeyFeaturesSection,
  LiveTrackingSection,
  OurServicesSection,
  PricingPlansSection,
} from "@/components/sections";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <KeyFeaturesSection />
      <LiveTrackingSection />
      <OurServicesSection />
      <PricingPlansSection />
      <CustomerSatisfactionSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
