"use client";

import { CheckCircle, MapPin, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export default function CustomerSatisfactionSection() {
  const features = [
    {
      icon: (
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
      ),
      title: "Real-time Tracking",
      description:
        "Monitor your package journey from pickup to delivery with live updates.",
    },
    {
      icon: (
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
      ),
      title: "Secure Handling",
      description:
        "Your packages are handled with care using best-in-class security protocols.",
    },
    {
      icon: (
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
      ),
      title: "On-time Delivery",
      description:
        "99% on-time delivery rate with our efficient logistics network.",
    },
  ];

  const stats = [
    {
      value: "99.5%",
      label: "Delivery Success",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: "4.8",
      label: "Customer Rating",
      icon: <Star className="h-4 w-4" />,
    },
    {
      value: "<24h",
      label: "Average Delivery",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    { value: "24/7", label: "Support", icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-red-500/10 to-green-500/10 border border-red-200 dark:border-red-800 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-foreground">Customer First Approach</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Customer Satisfaction is Our{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Priority
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to providing exceptional service that exceeds your
            expectations. Our customer-first approach ensures reliable, secure,
            and timely delivery every time.
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-muted/50 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    {feature.icon}
                    <div className="absolute -inset-2 bg-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {}
                <motion.div
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 group hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl group-hover:scale-110 transition-transform">
                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Customer Rating
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                        >
                          <Star className="h-6 w-6 text-yellow-400 fill-current drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        5.0
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        out of 5
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Based on 25,000+ reviews
                  </p>
                </motion.div>

                {}
                <motion.div
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 group hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Happy Customers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white dark:border-gray-800 flex items-center justify-center"
                        >
                          <span className="text-xs font-bold text-white">
                            {String.fromCharCode(64 + i)}
                          </span>
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">+</span>
                      </div>
                    </div>
                    <div>
                      <motion.span
                        className="text-2xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      >
                        50,000+
                      </motion.span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Served across Bangladesh
                  </p>
                </motion.div>
              </div>

              {}
              <motion.div
                className="mt-6 inline-flex items-center bg-card border border-border rounded-full px-4 py-2 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-foreground">
                  Verified by
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-1">
                  TrustPilot
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {}
            <div className="relative mb-8 group">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src="/courier-merchant.jpeg"
                  alt="Professional courier merchant delivering packages"
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {}
                <motion.div
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">99.5% Success</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                    Professional Service
                  </h3>
                  <p className="text-gray-200 drop-shadow">
                    Trusted by merchants & customers nationwide
                  </p>
                </motion.div>
              </div>
            </div>

            {}
            <motion.div
              className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Nationwide Coverage</h3>
                    <p className="text-red-100 dark:text-red-200">
                      All 64 districts of Bangladesh
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="text-3xl font-bold group-hover:scale-110 transition-transform">
                          {stat.value}
                        </div>
                        <div className="text-red-200 group-hover:text-white transition-colors">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-red-100 dark:text-red-200 text-sm">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

