"use client";

import { Award, Globe, Package, Star, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function PartnersSection() {
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
      name: "Dynamic Group",
      logo: "/partners/dynamic.png",
      category: "Conglomerate",
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Expand your business reach with our nationwide delivery network",
    },
    {
      icon: TrendingUp,
      title: "Growth Support",
      description: "Scale your business with our flexible logistics solutions",
    },
    {
      icon: Award,
      title: "Reliability",
      description:
        "99% on-time delivery rate ensures your customers stay satisfied",
    },
  ];

  return (
    <section
      id="partners"
      className="py-20 bg-gradient-to-br from-background via-background to-accent/10"
    >
      {}
      <div className="max-w-7xl mx-auto px-6">
        {}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Our Partners
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-700 bg-clip-text text-transparent">
              Trusted Partners
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading businesses across Bangladesh to deliver
            excellence in logistics and parcel management.
          </p>
        </div>

        {}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:bg-card/60 transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {partner.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {partner.category}
              </p>
            </div>
          ))}
        </div>

        {}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Partner with Us?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Join our network of successful partners and unlock new growth
            opportunities for your business.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:bg-card/60 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help grow your business together.
            Contact our partnership team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Become a Partner
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 bg-card hover:bg-accent text-foreground font-semibold rounded-2xl transition-all duration-300 hover:scale-105 border border-border/40 hover:border-border/60 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Contact Sales
            </Link>
          </div>
        </div>

        {}
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
    </section>
  );
}

