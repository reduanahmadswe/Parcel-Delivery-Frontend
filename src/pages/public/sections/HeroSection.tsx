import {
  ArrowRight,
  Clock,
  Package,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import FloatingParticles from "./FloatingParticles";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {}
      <div className="absolute inset-0 z-0">
        {}
        <picture>
          <source media="(max-width: 640px)" srcSet="/delivery-mobile.jpg" />
          <img
            src="/Pathao-Shop.jpg"
            alt="Professional delivery person with packages"
            className="object-cover object-center w-full h-full xs:h-[320px] sm:h-[500px] md:h-[700px] lg:h-screen scale-105 hover:scale-100 transition-transform duration-[10s] ease-out"
          />
        </picture>
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30"></div>
      </div>

      {}
      <FloatingParticles />

      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-red-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 w-full text-center">
          {}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative inline-flex items-center bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 text-sm font-semibold mb-8 border border-white/20 shadow-2xl group hover:bg-white/15 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Shield className="relative w-5 h-5 mr-3 text-emerald-400" />
            <span className="relative text-white">
              Trusted by 1M+ customers nationwide
            </span>
            <Star className="relative w-5 h-5 ml-3 text-yellow-400 fill-current animate-pulse" />
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="space-y-4 xs:space-y-5 sm:space-y-6"
          >
            <motion.h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="block"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 20px rgba(255,255,255,0.3)",
                    "0 0 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Lightning
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Fast Delivery
              </motion.span>
            </motion.h1>
          </motion.div>

          {}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experience{" "}
            <motion.span
              className="font-semibold text-white"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              next-generation
            </motion.span>{" "}
            parcel delivery across Bangladesh. Secure, fast, and reliable
            service for all your shipping needs.
          </motion.p>

          {}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col xs:flex-row gap-3 xs:gap-6 justify-center items-center mb-10 sm:mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <Link
                to="/sender/create-parcel"
                className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 xs:px-8 sm:px-12 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold text-base xs:text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 xs:gap-3 shadow-2xl border border-red-400/50 backdrop-blur-sm"
              >
                <Package className="w-6 h-6" />
                Send Package
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
              <Link
                to="/track"
                className="relative bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-4 xs:px-8 sm:px-12 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold text-base xs:text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 xs:gap-3 shadow-xl hover:shadow-2xl"
              >
                <Package className="w-6 h-6" />
                Track Package
              </Link>
            </motion.div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-2 xs:gap-4 sm:gap-6 mt-6 sm:mt-12 pt-6 sm:pt-8 border-t border-white/25"
          >
            {}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group flex items-center gap-2 xs:gap-3 bg-white/10 backdrop-blur-lg rounded-2xl px-3 xs:px-6 py-2 xs:py-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base xs:text-xl font-bold text-white">24/7</div>
                <div className="text-gray-200 text-xs xs:text-sm font-medium">Support</div>
              </div>
            </motion.div>

            {}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group flex items-center gap-2 xs:gap-3 bg-white/10 backdrop-blur-lg rounded-2xl px-3 xs:px-6 py-2 xs:py-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base xs:text-xl font-bold text-white">Same Day</div>
                <div className="text-gray-200 text-xs xs:text-sm font-medium">
                  Express*
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group flex items-center gap-2 xs:gap-3 bg-white/10 backdrop-blur-lg rounded-2xl px-3 xs:px-6 py-2 xs:py-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base xs:text-xl font-bold text-white">99.9%</div>
                <div className="text-gray-200 text-xs xs:text-sm font-medium">Success</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

