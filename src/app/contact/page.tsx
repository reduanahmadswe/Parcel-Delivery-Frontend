"use client";

import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+880 1700-000000",
      description: "24/7 Customer Support",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@parceltrack.bd",
      description: "Response within 2 hours",
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: "Dhaka, Bangladesh",
      description: "Visit us during business hours",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "24/7 Available",
      description: "Round the clock service",
    },
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Get In Touch
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-700 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our services? Need support? We&apos;re here to
            help you 24/7.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {info.title}
              </h3>
              <p className="text-lg font-medium text-red-600 mb-1">
                {info.details}
              </p>
              <p className="text-sm text-muted-foreground">
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Send us a message
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-colors duration-200"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-colors duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-colors duration-200"
                    placeholder="+880 1700-000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-colors duration-200"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="billing">Billing Question</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-colors duration-200 resize-vertical"
                  placeholder="Please describe how we can help you..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I track my parcel?",
                    answer:
                      "Use our tracking system with your tracking ID to get real-time updates.",
                  },
                  {
                    question: "What are your delivery areas?",
                    answer:
                      "We deliver nationwide across all 64 districts in Bangladesh.",
                  },
                  {
                    question: "How long does delivery take?",
                    answer:
                      "Same-day delivery in Dhaka, 1-3 days for other areas.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="border-b border-border/20 pb-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Emergency Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Need immediate assistance? Our emergency hotline is available
                24/7 for urgent delivery issues.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Emergency Hotline
                  </p>
                  <p className="text-red-600 font-medium">+880 1700-URGENT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
