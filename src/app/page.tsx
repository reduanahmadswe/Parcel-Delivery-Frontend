import {
  ContactSection,
  CTASection,
  CustomerSatisfactionSection,
  FooterSection,
  HeroSection,
  KeyFeaturesSection,
  LiveTrackingSection,
  OurServicesSection,
  PartnersSection,
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
      <PartnersSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
