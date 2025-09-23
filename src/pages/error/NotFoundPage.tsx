import {
  ArrowLeft,
  Clock,
  Home,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="max-w-lg w-full relative z-10">
        {/* Main 404 Content */}
        <div className="text-center space-y-10 animate-fade-in">
          {/* Modern Logo Design */}
          <div className="relative">
            <div className="w-40 h-40 mx-auto relative">
              {/* Main Logo Container using project colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-3xl shadow-2xl transform rotate-6 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-muted to-accent rounded-3xl shadow-xl transform -rotate-3"></div>
              <div className="relative w-full h-full bg-card border border-border rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
                {/* Logo Icon Stack */}
                <div className="relative">
                  <Package className="h-16 w-16 text-primary absolute transform -translate-x-2 -translate-y-2" />
                  <Truck className="h-12 w-12 text-muted-foreground absolute top-8 left-8 transform rotate-12" />
                  <MapPin className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Floating Particles using project colors */}
            <div className="absolute -top-6 -left-6 w-3 h-3 bg-primary rounded-full animate-ping"></div>
            <div
              className="absolute -top-4 right-8 w-2 h-2 bg-secondary rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -bottom-6 -right-6 w-4 h-4 bg-accent rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-8 -left-8 w-2 h-2 bg-muted rounded-full animate-ping"
              style={{ animationDelay: "3s" }}
            ></div>
          </div>

          {/* Enhanced 404 Text using project colors */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-9xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent tracking-tighter">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
            </div>

            <h2 className="text-3xl font-bold text-foreground">
              Parcel Not Found
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Looks like this delivery got lost in transit! Don't worry, we'll
              help you find your way back to the main route.
            </p>
          </div>

          {/* Enhanced Action Buttons using project colors */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group flex items-center justify-center space-x-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            >
              <Home className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Return Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center space-x-3 px-8 py-4 bg-card border-2 border-border text-card-foreground rounded-2xl font-semibold hover:bg-accent hover:border-accent-foreground/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Enhanced Search Section using project colors */}
          <div className="pt-8 border-t border-border">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">
                Quick Search & Navigation
              </p>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search parcels, track deliveries, find pages..."
                className="w-full pl-12 pr-4 py-4 bg-input border-2 border-border rounded-2xl focus:ring-4 focus:ring-ring/20 focus:border-ring transition-all duration-300 placeholder-muted-foreground font-medium shadow-lg text-foreground"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      window.location.href = `/?search=${encodeURIComponent(
                        query
                      )}`;
                    }
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-lg font-medium">
                Enter
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links using project colors */}
          <div className="pt-6">
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              Popular Destinations:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                to="/track"
                className="group flex flex-col items-center space-y-2 p-4 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <Package className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium text-card-foreground">
                  Track
                </span>
              </Link>

              <Link
                to="/login"
                className="group flex flex-col items-center space-y-2 p-4 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <MapPin className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-card-foreground">
                  Login
                </span>
              </Link>

              <Link
                to="/contact"
                className="group flex flex-col items-center space-y-2 p-4 bg-card border border-border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md col-span-2 sm:col-span-1"
              >
                <Truck className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-medium text-card-foreground">
                  Support
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

