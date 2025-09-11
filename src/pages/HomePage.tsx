import React from "react";
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
} from "./sections";

const HomePage: React.FC = () => {
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
};

export default HomePage;
