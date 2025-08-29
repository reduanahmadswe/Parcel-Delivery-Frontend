"use client";

import { ArrowRight, Package, Shield, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] md:h-[70vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Pathao-Shop.jpg"
          alt="Professional delivery person with packages"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        {/* Overlay for better text readability - responsive to theme */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 md:py-20">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left text-white dark:text-gray-100">
            <div className="inline-flex items-center bg-white/20 dark:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2 text-white dark:text-gray-100" />
              <span className="text-white dark:text-gray-100">
                Trusted by 1M+ customers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white dark:text-gray-100 drop-shadow-lg">
              Fast & Reliable
              <span className="block text-red-300 dark:text-red-600">
                Parcel Delivery
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-100 dark:text-gray-200 mb-8 max-w-2xl lg:max-w-none drop-shadow">
              Send and track your packages across Bangladesh with our secure and
              efficient delivery service. From documents to large parcels,
              we&apos;ve got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/sender/create-parcel"
                className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg"
              >
                Send Package
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/track"
                className="bg-white/20 dark:bg-white/30 backdrop-blur-sm border-2 border-white dark:border-gray-100 text-white dark:text-gray-100 hover:bg-white hover:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                Track Package
                <Package className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/30 dark:border-gray-100/40">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white dark:text-gray-100 drop-shadow">
                  24/7
                </div>
                <div className="text-gray-200 dark:text-gray-300 text-sm">
                  Support
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white dark:text-gray-100 drop-shadow">
                  Same Day
                </div>
                <div className="text-gray-200 dark:text-gray-300 text-sm">
                  Delivery*
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white dark:text-gray-100 drop-shadow">
                  99.9%
                </div>
                <div className="text-gray-200 dark:text-gray-300 text-sm">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transparent Overlay Card */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <div className="bg-white/10 dark:bg-white/15 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-white/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 dark:bg-white/25 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white dark:text-gray-100" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white dark:text-gray-100">
                      Live Tracking
                    </h3>
                    <p className="text-gray-200 dark:text-gray-300 text-sm">
                      Real-time updates
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full"></div>
                    <span className="text-sm text-white dark:text-gray-100">
                      Package picked up
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-white dark:text-gray-100">
                      In transit
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white dark:text-gray-100">
                      Out for delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 dark:bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 dark:bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
