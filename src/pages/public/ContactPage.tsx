import React from "react";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default ContactPage;

