"use client";

import { CheckCircle } from "lucide-react";

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
    <section className="py-20 bg-background">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl transition-all duration-200 hover:shadow-lg ${
                plan.popular
                  ? "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white"
                  : "bg-card border border-gray-300 dark:border-gray-600 hover:border-red-500"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.popular ? "text-white" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.popular
                      ? "text-red-100 dark:text-red-200"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-white" : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`ml-1 ${
                      plan.popular
                        ? "text-red-100 dark:text-red-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    /delivery
                  </span>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span
                      className={`text-sm ${
                        plan.popular
                          ? "text-red-100 dark:text-red-200"
                          : "text-muted-foreground"
                      }`}
                    >
                      Real-time tracking
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span
                      className={`text-sm ${
                        plan.popular
                          ? "text-red-100 dark:text-red-200"
                          : "text-muted-foreground"
                      }`}
                    >
                      Insurance coverage
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span
                      className={`text-sm ${
                        plan.popular
                          ? "text-red-100 dark:text-red-200"
                          : "text-muted-foreground"
                      }`}
                    >
                      24/7 support
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full mt-8 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-white text-red-600 hover:bg-gray-100"
                      : "border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 text-foreground"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
