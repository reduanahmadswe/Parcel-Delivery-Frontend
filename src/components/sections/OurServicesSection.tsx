"use client";

import { Clock, Globe, Package, Shield, Truck } from "lucide-react";

export default function OurServicesSection() {
  const mainServices = [
    {
      icon: <Truck className="h-16 w-16 text-green-500" />,
      title: "Express Delivery & Standard Delivery",
      description:
        "Fast and reliable delivery services with multiple speed options to meet your needs.",
    },
    {
      icon: <Globe className="h-16 w-16 text-green-500" />,
      title: "Nationwide Delivery All Districts",
      description:
        "Complete coverage across all districts of Bangladesh with extensive delivery network.",
    },
    {
      icon: <Package className="h-16 w-16 text-green-500" />,
      title: "Fulfillment Solution",
      description:
        "End-to-end fulfillment services including warehousing, packing, and distribution.",
    },
    {
      icon: <Clock className="h-16 w-16 text-green-500" />,
      title: "Same Day Delivery",
      description:
        "Ultra-fast same-day delivery service for urgent packages within city limits.",
    },
    {
      icon: <Truck className="h-16 w-16 text-green-500" />,
      title: "Corporate Service (Merchant Logistics)",
      description:
        "Dedicated logistics solutions for businesses with bulk shipping requirements.",
    },
    {
      icon: <Shield className="h-16 w-16 text-green-500" />,
      title: "Damage and Loss Coverage",
      description:
        "Comprehensive insurance coverage protecting your valuable shipments against damage and loss.",
    },
  ];

  return (
    <section className="py-20 bg-background">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainServices.map((service, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl transition-all duration-200 hover:shadow-lg ${
                index === 2 // Make "Fulfillment Solution" the popular card
                  ? "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white"
                  : "bg-card border border-gray-300 dark:border-gray-600 hover:border-red-500"
              }`}
            >
              {index === 2 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex justify-center mb-6">{service.icon}</div>
              <h3
                className={`text-xl font-bold mb-4 ${
                  index === 2 ? "text-white" : "text-foreground"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`leading-relaxed ${
                  index === 2
                    ? "text-red-100 dark:text-red-200"
                    : "text-muted-foreground"
                }`}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
