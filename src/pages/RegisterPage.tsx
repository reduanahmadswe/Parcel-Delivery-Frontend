import { ArrowLeft, Package, Shield, Star, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MultiStepRegisterForm = React.lazy(() =>
  import("../components/modules/Authentication/MultiStepRegisterForm").then(
    (module) => ({
      default: module.MultiStepRegisterForm,
    })
  )
);

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="min-h-screen grid lg:grid-cols-5">
        {/* Left Panel - Form (3 columns) */}
        <div className="lg:col-span-2 flex flex-col relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
            <div
              className="absolute bottom-32 right-10 w-40 h-40 bg-green-500/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Header */}
          <div className="relative z-10 p-6 lg:p-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 group hover:scale-105"
            >
              <div className="p-2 rounded-xl bg-accent/50 group-hover:bg-accent transition-colors duration-300">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-foreground block">
                    ParcelTrack
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Join Our Network
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Form Container */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="space-y-6">
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
                    </div>
                  }
                >
                  <MultiStepRegisterForm />
                </React.Suspense>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 lg:p-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Data Protection</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-500" />
                <span>Growing Community</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>Premium Service</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 ParcelTrack. All rights reserved. Secure delivery solutions
              for Bangladesh.
            </p>
          </div>
        </div>

        {/* Right Panel - Hero Image (2 columns) */}
        <div className="lg:col-span-3 relative overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-blue-950/30 dark:via-green-950/30 dark:to-teal-950/30">
          {/* Enhanced Hero Image with Better Fit */}
          <div className="absolute inset-0">
            <img
              src="/Pathao-Shop.jpg"
              alt="Join Parcel Delivery Network"
              className="w-full h-full object-cover object-center scale-110 hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                filter: "brightness(0.85) contrast(1.1) saturate(1.2)",
              }}
            />

            {/* Enhanced Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-green-600/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-500/5 to-blue-500/10" />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 animate-bounce">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  Join Network
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 left-10 animate-pulse">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 max-w-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Growing Network
                  </p>
                  <p className="text-white/80 text-xs">
                    10,000+ Active Members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full w-3/5" />
                </div>
                <span className="text-white/90 text-xs font-medium">60%</span>
              </div>
            </div>
          </div>

          {/* Enhanced Brand Watermark */}
          <div className="absolute bottom-8 right-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">ParcelTrack</p>
                  <p className="text-white/70 text-xs">
                    Join Our Professional Network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
