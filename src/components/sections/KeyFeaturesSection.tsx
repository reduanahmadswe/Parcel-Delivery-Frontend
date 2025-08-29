"use client";

import { HeadphonesIcon, Package, Shield } from "lucide-react";

export default function KeyFeaturesSection() {
  const services = [
    {
      icon: <Package className="h-12 w-12 text-green-500" />,
      title: "Live Parcel Tracking",
      description:
        "Real-time tracking with GPS location updates and delivery status notifications.",
    },
    {
      icon: <Shield className="h-12 w-12 text-green-500" />,
      title: "100% Safe Delivery",
      description:
        "Secure handling with insurance coverage and verified delivery confirmation.",
    },
    {
      icon: <HeadphonesIcon className="h-12 w-12 text-green-500" />,
      title: "24/7 Call Center Support",
      description:
        "Round-the-clock customer support for all your delivery needs and queries.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-8 bg-card border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm"
            >
              <div className="flex justify-center mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
