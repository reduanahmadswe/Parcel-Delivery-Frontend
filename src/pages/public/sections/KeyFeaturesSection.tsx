"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { HeadphonesIcon, MapPin, Package, Shield, Star } from "lucide-react";
import { motion } from "motion/react";

export default function KeyFeaturesSection() {
  const features = [
    {
      title: "Live Parcel Tracking",
      description:
        "Real-time GPS tracking with instant updates and delivery notifications for complete peace of mind.",
      icon: <MapPin className="h-12 w-12 text-green-500" />,
      link: "#live-tracking",
    },
    {
      title: "100% Safe Delivery",
      description:
        "Advanced security measures with insurance coverage and verified delivery confirmation system.",
      icon: <Shield className="h-12 w-12 text-green-500" />,
      link: "#safe-delivery",
    },
    {
      title: "24/7 Call Center Support",
      description:
        "Round-the-clock expert customer support with multilingual assistance and quick resolution.",
      icon: <HeadphonesIcon className="h-12 w-12 text-green-500" />,
      link: "#support",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-muted/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-foreground">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of parcel delivery with our cutting-edge
            features designed for reliability, security, and customer
            satisfaction.
          </p>
        </motion.div>

        {}
        <HoverEffect items={features} className="grid md:grid-cols-3 gap-8" />

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Ready to experience the difference?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Package className="w-5 h-5" />
            Start Your Delivery
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

