"use client";

import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";

export default function CustomerSatisfactionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Customer Satisfaction is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We are committed to providing exceptional service that exceeds
              your expectations. Our customer-first approach ensures reliable,
              secure, and timely delivery every time.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Real-time Tracking
                  </h4>
                  <p className="text-muted-foreground">
                    Monitor your package journey from pickup to delivery with
                    live updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Secure Handling
                  </h4>
                  <p className="text-muted-foreground">
                    Your packages are handled with care using best-in-class
                    security protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    On-time Delivery
                  </h4>
                  <p className="text-muted-foreground">
                    99% on-time delivery rate with our efficient logistics
                    network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image and Stats */}
          <div className="relative">
            {/* Courier Merchant Image */}
            <div className="relative mb-8">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/courier-merchant.jpeg"
                  alt="Professional courier merchant delivering packages"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Professional Service
                  </h3>
                  <p className="text-gray-200">
                    Trusted by merchants & customers nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-3xl p-8 text-white">
              <div className="flex items-center space-x-4 mb-6">
                <MapPin className="h-8 w-8" />
                <div>
                  <h3 className="text-2xl font-bold">Nationwide Coverage</h3>
                  <p className="text-red-100 dark:text-red-200">
                    All 64 districts of Bangladesh
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">99.5%</div>
                  <div className="text-red-100 dark:text-red-200 text-sm">
                    Delivery Success
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4.8★</div>
                  <div className="text-red-100 dark:text-red-200 text-sm">
                    Customer Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">&lt;24h</div>
                  <div className="text-red-100 dark:text-red-200 text-sm">
                    Average Delivery
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-red-100 dark:text-red-200 text-sm">
                    Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
