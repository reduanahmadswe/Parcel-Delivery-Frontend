"use client";

import {
  ArrowLeft,
  Award,
  Globe,
  Package,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
  const partners = [
    {
      name: "The Business Standard",
      logo: "/partners/business-standard.png",
      category: "Media Partner",
    },
    {
      name: "Shajgoj",
      logo: "/partners/shajgoj.png",
      category: "Beauty & Lifestyle",
    },
    {
      name: "Nagad",
      logo: "/partners/nagad.png",
      category: "Financial Services",
    },
    {
      name: "LivingTex",
      logo: "/partners/livingtex.png",
      category: "Textile Industry",
    },
    {
      name: "IDLC Finance",
      logo: "/partners/idlc.png",
      category: "Financial Services",
    },
    {
      name: "Fabrilife",
      logo: "/partners/fabrilife.png",
      category: "Fashion & Apparel",
    },
    {
      name: "East West University",
      logo: "/partners/ewu.png",
      category: "Education",
    },
    {
      name: "DCCI",
      logo: "/partners/dcci.png",
      category: "Chamber of Commerce",
    },
    {
      name: "Global Brand",
      logo: "/partners/global-brand.png",
      category: "International",
    },
    {
      name: "Bata",
      logo: "/partners/bata.png",
      category: "Footwear",
    },
  ];

  const stats = [
    { icon: Users, label: "Happy Clients", value: "1000+" },
    { icon: Package, label: "Deliveries", value: "1M+" },
    { icon: Globe, label: "Cities Covered", value: "64" },
    { icon: Award, label: "Success Rate", value: "99.9%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <div className="p-2 rounded-xl bg-accent/50 group-hover:bg-accent transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-foreground block">
                  ParcelTrack
                </span>
                <span className="text-xs text-muted-foreground">
                  Back to Home
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Trusted by Industry Leaders
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-700 bg-clip-text text-transparent">
              Powering growth
            </span>
            <br />
            <span className="text-foreground">for amazing businesses</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;re proud to partner with Bangladesh&apos;s most innovative
            companies, helping them scale their operations through reliable
            delivery solutions.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Trusted by amazing businesses
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:bg-card/60 hover:border-border/60 transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                {/* Partner Logo Placeholder */}
                <div className="aspect-square bg-muted/20 rounded-xl mb-4 flex items-center justify-center border border-border/20">
                  <div className="text-4xl font-bold text-muted-foreground/30">
                    {partner.name.charAt(0)}
                  </div>
                </div>

                {/* Partner Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-red-600 transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {partner.category}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 rounded-3xl p-12 border border-red-200/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to join our growing network?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Partner with ParcelTrack and experience the reliability that
              industry leaders trust. Let&apos;s grow your business together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Get Started Today
              </Link>

              <Link
                href="/contact"
                className="px-8 py-4 bg-card hover:bg-accent text-foreground font-semibold rounded-2xl transition-all duration-300 hover:scale-105 border border-border/40 hover:border-border/60 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Success Stories Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            What our partners say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:bg-card/60 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &quot;ParcelTrack has transformed our delivery operations.
                  Their reliability and speed are unmatched.&quot;
                </p>
                <div className="text-sm font-semibold text-foreground">
                  Business Partner #{i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
