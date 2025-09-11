"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Package,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
    <footer className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-foreground">
                Parcel Delivery
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Bangladesh&apos;s most trusted courier service providing fast,
              reliable, and secure delivery solutions nationwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#facebook"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#twitter"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#linkedin"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#instagram"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Our Services
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#express-delivery-service"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Express Delivery
                </a>
              </li>
              <li>
                <a
                  href="#standard-delivery-service"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Standard Delivery
                </a>
              </li>
              <li>
                <a
                  href="#same-day-delivery-service"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Same Day Delivery
                </a>
              </li>
              <li>
                <a
                  href="#corporate-solutions-service"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Corporate Solutions
                </a>
              </li>
              <li>
                <a
                  href="#international-shipping-service"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  International Shipping
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/track"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Track Package
                </Link>
              </li>
              <li>
                <a
                  href="#help-center"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact-us"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#report-issue"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground">
                    123 Main Street, Dhaka 1000, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-muted-foreground">+880 1700-000000</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-muted-foreground">info@parceldelivery.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 border border-border rounded-l-lg focus:outline-none focus:border-red-500 bg-background text-foreground"
                />
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Parcel Delivery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#privacy-policy"
                className="text-muted-foreground hover:text-red-500 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms-of-service"
                className="text-muted-foreground hover:text-red-500 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#cookie-policy"
                className="text-muted-foreground hover:text-red-500 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
