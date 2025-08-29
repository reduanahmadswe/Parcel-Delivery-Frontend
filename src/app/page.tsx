import { 
  CTASection,
  CustomerSatisfactionSection,
  FooterSection,
  HeroSection,
  KeyFeaturesSection,
  OurServicesSection,
  PricingPlansSection
} from "@/components/sections";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <KeyFeaturesSection />
      <OurServicesSection />
      <PricingPlansSection />
      <CustomerSatisfactionSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
