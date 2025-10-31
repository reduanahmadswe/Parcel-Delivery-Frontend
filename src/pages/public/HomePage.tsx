import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const dashboardPath = user.role === "admin" ? "/admin/dashboard"
                          : user.role === "sender" ? "/sender/dashboard"
                          : user.role === "receiver" ? "/receiver/dashboard"
                          : "/";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

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

