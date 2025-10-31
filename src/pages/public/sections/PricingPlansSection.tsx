"use client";

import { PricingHoverEffect } from "@/components/ui/pricing-hover-effect";

export default function PricingPlansSection() {
  const pricingPlans = [
    {
      name: "Inside Dhaka",
      description: "Same City Delivery Service",
      price: "৳60",
      popular: false,
    },
    {
      name: "Dhaka District",
      description: "City to City Service",
      price: "৳100",
      popular: false,
    },
    {
      name: "Outside Dhaka",
      description: "Outside Dhaka Service",
      price: "৳120",
      popular: true,
    },
    {
      name: "24 Hours",
      description: "Express Service",
      price: "৳150",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, honest pricing for all your delivery needs. No hidden fees,
            no surprises.
          </p>
        </div>

        <PricingHoverEffect items={pricingPlans} />
      </div>
    </section>
  );
}

