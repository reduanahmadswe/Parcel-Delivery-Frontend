"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Clock, Globe, Package, Shield, Truck } from "lucide-react";

export default function OurServicesSection() {
  const mainServices = [
    {
      title: "Express Delivery & Standard Delivery",
      description:
        "Fast and reliable delivery services with multiple speed options to meet your needs.",
      link: "#express-delivery",
      icon: <Truck className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Nationwide Delivery All Districts",
      description:
        "Complete coverage across all districts of Bangladesh with extensive delivery network.",
      link: "#nationwide-delivery",
      icon: <Globe className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Fulfillment Solution",
      description:
        "End-to-end fulfillment services including warehousing, packing, and distribution.",
      link: "#fulfillment-solution",
      icon: <Package className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Same Day Delivery",
      description:
        "Ultra-fast same-day delivery service for urgent packages within city limits.",
      link: "#same-day-delivery",
      icon: <Clock className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Corporate Service (Merchant Logistics)",
      description:
        "Dedicated logistics solutions for businesses with bulk shipping requirements.",
      link: "#corporate-service",
      icon: <Truck className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Damage and Loss Coverage",
      description:
        "Comprehensive insurance coverage protecting your valuable shipments against damage and loss.",
      link: "#insurance-coverage",
      icon: <Shield className="h-16 w-16 text-green-500" />,
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive courier solutions designed to meet all your delivery
            needs across Bangladesh
          </p>
        </div>

        <HoverEffect items={mainServices} />
      </div>
    </section>
  );
}

