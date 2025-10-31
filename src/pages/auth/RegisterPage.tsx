import { ArrowLeft, Package, Shield, Star, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MultiStepRegisterForm = React.lazy(() =>
  import("../../components/forms/MultiStepRegisterForm").then(
    (module) => ({
      default: module.MultiStepRegisterForm,
    })
  )
);

const RegisterPage: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-background to-red-50/20 dark:to-red-950/10">
      <div className="h-screen grid lg:grid-cols-5">
        {}
        <div className="lg:col-span-2 flex flex-col relative overflow-y-auto">
          {}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/5 dark:bg-red-400/10 rounded-full blur-2xl animate-pulse" />
            <div
              className="absolute bottom-32 right-10 w-40 h-40 bg-red-600/5 dark:bg-red-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {}
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 flex-shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group hover:scale-105"
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-red-50 dark:bg-red-950/50 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-base sm:text-lg text-foreground block">
                    ParcelTrack
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Join Our Network
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {}
          <div className="relative z-10 flex-1 flex items-start lg:items-center justify-center px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 overflow-y-auto">
            <div className="w-full max-w-md my-auto">
              <div className="space-y-3 sm:space-y-4">
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-500" />
                    </div>
                  }
                >
                  <MultiStepRegisterForm />
                </React.Suspense>
              </div>
            </div>
          </div>

          {}
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 text-center space-y-2 flex-shrink-0 border-t border-border/30 dark:border-border/20 bg-background/50 dark:bg-background/30">
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                <span className="hidden sm:inline">Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-red-600 dark:text-red-500 flex-shrink-0" />
                <span className="hidden sm:inline">Community</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                <span className="hidden sm:inline">Premium</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              © 2025 ParcelTrack. All rights reserved.
            </p>
          </div>
        </div>

        {}
        <div className="hidden lg:block lg:col-span-3 relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-red-950/30 dark:via-orange-950/20 dark:to-red-900/30">
          {}
          <div className="absolute inset-0">
            <img
              src="/signup.png"
              alt="Join Parcel Delivery Network"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                filter: "brightness(0.95) contrast(1.05) saturate(1.1)",
              }}
            />

            {}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-orange-600/5 dark:from-red-900/40 dark:via-transparent dark:to-orange-900/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 dark:from-black/50 dark:via-transparent dark:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/5 to-orange-500/10 dark:from-transparent dark:via-red-800/10 dark:to-orange-800/15" />
          </div>

          {}
          <div className="absolute top-10 right-10 animate-bounce">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 dark:bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium drop-shadow-md">
                  Join Network
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 left-10 animate-pulse">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/10 max-w-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm drop-shadow-md">
                    Growing Network
                  </p>
                  <p className="text-white/80 dark:text-white/70 text-xs">
                    10,000+ Active Members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 dark:bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-400 to-orange-500 dark:from-red-500 dark:to-orange-600 h-2 rounded-full w-3/5" />
                </div>
                <span className="text-white/90 dark:text-white/80 text-xs font-medium drop-shadow-md">60%</span>
              </div>
            </div>
          </div>

          {}
          <div className="absolute bottom-8 right-8">
            <div className="bg-white/5 dark:bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 dark:border-white/5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg drop-shadow-md">ParcelTrack</p>
                  <p className="text-white/70 dark:text-white/60 text-xs">
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

