import {
  ArrowLeft,
  Clock,
  Home,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterSection from "../public/sections/FooterSection";


const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <main className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-2xl w-full mx-auto relative z-10">
          <div className="animate-fade-in bg-transparent">
            <div className="grid grid-cols-1 gap-6 items-center justify-items-center text-center">
            {/* Content (centered) */}
            <div className="space-y-6 p-4 sm:p-6 w-full">
              {/* Logo above the heading */}
              <div className="flex justify-center mb-2">
                <div className="bg-white/95 dark:bg-card p-3 rounded-full shadow-2xl flex items-center justify-center ring-1 ring-border">
                  <img src="/package.svg" alt="ParcelTrack logo" className="w-24 h-24 rounded-full object-contain" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent tracking-tighter">
                  404
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Looks like this delivery got lost in transit. Don't worry — we
                help you find your way back to the main route or resume where
                you left off.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="parcel-btn-primary inline-flex items-center justify-center space-x-3 px-6 py-3"
                >
                  <Home className="h-5 w-5" />
                  <span>Return Home</span>
                </Link>

                <button
                  onClick={() => navigate(-1)}
                  className="parcel-btn-secondary inline-flex items-center justify-center space-x-3 px-6 py-3"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Go Back</span>
                </button>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Quick Search & Navigation
                  </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    aria-label="Search parcels"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search parcels, track deliveries, find pages..."
                    className="w-full pl-12 pr-36 py-3 bg-input border-2 border-border rounded-2xl focus:ring-4 focus:ring-ring/20 focus:border-ring transition-all duration-300 placeholder-muted-foreground font-medium shadow-sm text-foreground"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 parcel-btn-primary text-sm px-4 py-2 rounded-full shadow-lg hover:shadow-2xl transition-all duration-200"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Popular Destinations
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Link
                    to="/track"
                    className="group flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm"
                  >
                    <Package className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">
                      Track
                    </span>
                  </Link>

                  <Link
                    to="/login"
                    className="group flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm"
                  >
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">
                      Login
                    </span>
                  </Link>

                  <Link
                    to="/contact"
                    className="group flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm col-span-2 sm:col-span-1"
                  >
                    <Truck className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">
                      Support
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />

    </div>
  );
};

export default NotFoundPage;

