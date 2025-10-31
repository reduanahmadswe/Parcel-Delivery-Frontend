import {
  ArrowLeft,
  Clock,
  Globe,
  Package,
  Shield,
  Star,
  Truck,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (user) {
      const dashboardPath = 
        user.role === "admin" ? "/admin/dashboard" :
        user.role === "sender" ? "/sender/dashboard" :
        user.role === "receiver" ? "/receiver/dashboard" :
        "/";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-background dark:via-background dark:to-muted">
      <div className="min-h-screen grid lg:grid-cols-2">
        {}
        <div className="hidden lg:flex flex-col relative overflow-hidden">
          {}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-pink-600">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {}
          <div className="absolute inset-0">
            <img
              src="/parcel.jpg"
              alt="Modern Parcel Delivery"
              className="w-full h-full object-cover mix-blend-overlay opacity-90"
            />
          </div>

          {}
          <div className="absolute top-20 left-16 animate-float">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">50K+</p>
                  <p className="text-white/80 text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-16 animate-float-delayed">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">64 Cities</p>
                  <p className="text-white/80 text-sm">Nationwide Coverage</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-20 animate-float">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">99.9%</p>
                  <p className="text-white/80 text-sm">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="relative z-10 flex flex-col justify-center h-full px-16">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
                <Package className="w-4 h-4" />
                Professional Delivery Platform
              </div>

              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  ParcelTrack
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Bangladesh&apos;s most trusted parcel delivery service. Fast,
                secure, and reliable delivery solutions across the country.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Customer Support</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">1M+</div>
                  <div className="text-white/80 text-sm">
                    Deliveries Completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="absolute bottom-8 left-16">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm">Powered by ParcelTrack Technology</span>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col relative bg-white dark:bg-background">
          {}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {}
          <div className="relative z-10 p-6 lg:p-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 group"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 group-hover:from-red-100 group-hover:to-orange-100 dark:group-hover:from-red-900/50 dark:group-hover:to-orange-900/50 transition-colors duration-300">
                <ArrowLeft className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 dark:from-red-600 dark:to-red-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="font-bold text-2xl text-foreground block">
                    ParcelTrack
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Professional Delivery
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {}
          <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground text-lg">
                  Sign in to access your delivery dashboard
                </p>
              </div>

              <LoginForm />
            </div>
          </div>

          {}
          <div className="relative z-10 p-6 lg:p-8 border-t border-border/40">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  SSL Secured
                </p>
                <p className="text-xs text-muted-foreground">
                  Bank-grade security
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  24/7 Support
                </p>
                <p className="text-xs text-muted-foreground">
                  Always available
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Trusted Platform
                </p>
                <p className="text-xs text-muted-foreground">5-star rated</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2025 ParcelTrack. All rights reserved. Transforming delivery
                experience across Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <style>
        {`@keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } } @keyframes float-delayed { 0%,100% { transform: translateY(-10px); } 50% { transform: translateY(-30px); } } .animate-float { animation: float 6s ease-in-out infinite; } .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 2s; }`}
      </style>
    </div>
  );
};

export default LoginPage;

