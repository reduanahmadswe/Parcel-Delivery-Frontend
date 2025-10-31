"use client";

import {
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";

export default function LiveTrackingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-red-100 dark:bg-red-900/30 rounded-full px-6 py-3 mb-6"
          >
            <Navigation className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300 font-semibold text-sm">
              Real-time Tracking
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Track Your Package
            <span className="block text-transparent bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text">
              Every Step of the Way
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay informed with real-time updates on your package&apos;s journey
            from pickup to delivery with our advanced tracking system.
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-background rounded-3xl p-8 lg:p-12 shadow-2xl border mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Live Package Status
              </h3>
              <p className="text-muted-foreground">
                Tracking ID:{" "}
                <span className="font-mono font-semibold">#PD-2024-001234</span>
              </p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-700 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  Package Picked Up
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your package has been collected from the pickup location
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                  <Clock className="w-4 h-4" />
                  <span>Today, 9:30 AM</span>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-bold text-foreground mb-2">In Transit</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Package is on its way to the destination hub
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span>Today, 11:45 AM</span>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-700 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="w-3 h-3 bg-orange-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  Out for Delivery
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Delivery agent is on the way to your location
                </p>
                <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                  <Clock className="w-4 h-4" />
                  <span>Today, 2:15 PM</span>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/20 dark:to-slate-600/20 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-600 group-hover:shadow-lg transition-all duration-300 opacity-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                </div>
                <h4 className="font-bold text-foreground mb-2">Delivered</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Package will be delivered shortly
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Estimated: 4:00 PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Current Location</h4>
                <p className="text-red-100 dark:text-red-200">
                  Dhanmondi Distribution Hub, Dhaka - Expected delivery within 2
                  hours
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Navigation className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Real-time GPS Tracking
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your package&apos;s exact location with GPS precision and
              get live updates on delivery progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Instant Notifications
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive SMS and email notifications for every status update
              throughout your package journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Delivery Confirmation
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Get photo proof of delivery and digital signature confirmation for
              complete peace of mind.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

