"use client";

import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950/20 rounded-2xl mb-6">
          <Package className="h-8 w-8 text-green-500" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Ready to Send Your First Package?
        </h2>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us with their
          deliveries. Fast, secure, and reliable service across Bangladesh.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/sender/create-parcel"
            className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            Send Package Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/track"
            className="border-2 border-gray-300 dark:border-gray-600 text-foreground hover:border-red-500 hover:text-red-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            Track Package
            <Package className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-red-100 dark:text-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">50K+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">99%</div>
            <div className="text-sm text-muted-foreground">
              On-Time Delivery
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

