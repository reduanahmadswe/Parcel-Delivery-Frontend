
import { cn } from "../../utils/utils";
import { CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const PricingHoverEffect = ({
  items,
  className,
}: {
  items: {
    name: string;
    description: string;
    price: string;
    popular: boolean;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.name}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-muted dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="pricingHoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          <div
            className={`relative p-8 rounded-2xl transition-all duration-200 hover:shadow-lg ${
              item.popular
                ? "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white"
                : "bg-card border border-gray-300 dark:border-gray-600 hover:border-red-500"
            } relative z-20`}
          >
            {item.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center relative z-50">
              <h3
                className={`text-xl font-bold mb-2 ${
                  item.popular ? "text-white" : "text-foreground"
                }`}
              >
                {item.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  item.popular
                    ? "text-red-100 dark:text-red-200"
                    : "text-muted-foreground"
                }`}
              >
                {item.description}
              </p>

              <div className="mb-8">
                <span
                  className={`text-4xl font-bold ${
                    item.popular ? "text-white" : "text-foreground"
                  }`}
                >
                  {item.price}
                </span>
                <span
                  className={`ml-1 ${
                    item.popular
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
                      item.popular
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
                      item.popular
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
                      item.popular
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
                  item.popular
                    ? "bg-white text-red-600 hover:bg-gray-100"
                    : "border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 text-foreground"
                }`}
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

