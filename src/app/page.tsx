import { Clock, MapPin, Package, Search, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: "Easy Parcel Booking",
      description:
        "Book your parcel delivery in just a few clicks with our user-friendly interface.",
    },
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Real-time Tracking",
      description:
        "Track your parcels in real-time with detailed status updates and location information.",
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Secure & Reliable",
      description:
        "Your parcels are safe with our secure handling and reliable delivery network.",
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Fast Delivery",
      description:
        "Express delivery options available for urgent parcels with same-day delivery.",
    },
  ];

  const stats = [
    {
      label: "Parcels Delivered",
      value: "10,000+",
      icon: <Package className="h-6 w-6" />,
    },
    {
      label: "Happy Customers",
      value: "5,000+",
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: "Cities Covered",
      value: "50+",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      label: "Success Rate",
      value: "99.9%",
      icon: <Shield className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-theme">
      {/* Hero Section */}
      <section className="text-white gradient-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fast, Secure & Reliable
              <span className="block text-gray-200">Parcel Delivery</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Send and track your parcels with confidence. Our comprehensive
              delivery platform ensures your packages reach their destination
              safely and on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 inline-flex items-center justify-center text-white hover:transform hover:-translate-y-1 hover:shadow-brand-lg bg-white/10 border border-white/20 backdrop-blur-lg"
              >
                <Package className="mr-2 h-5 w-5" />
                Book a Delivery
              </Link>
              <Link
                href="/track"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 inline-flex items-center justify-center hover:bg-white hover:text-brand-darkest hover:transform hover:-translate-y-1"
              >
                <Search className="mr-2 h-5 w-5" />
                Track Parcel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Track Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Track Your Parcel
            </h2>
            <p className="text-lg text-gray-600">
              Enter your tracking ID to get real-time updates
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Link
              href="/track"
              className="block w-full text-white text-center py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-brand-lg gradient-brand-reverse"
            >
              Go to Tracking Page
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-theme-primary mb-4">
              Why Choose ParcelTrack?
            </h2>
            <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
              We provide comprehensive parcel delivery solutions with
              cutting-edge technology and exceptional customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-brand-sm hover:shadow-brand-md transition-all duration-200 gradient-brand-reverse"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 text-white gradient-brand"
        style={{
          background: "linear-gradient(135deg, #3C0753 0%, #720455 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 text-gray-200">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their parcel
            delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #720455 0%, #910A67 100%)",
              }}
            >
              Create Account
            </Link>
            <Link
              href="/track"
              className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:bg-purple-600 hover:text-white hover:transform hover:-translate-y-1"
              style={{
                borderColor: "#720455",
                color: "#720455",
              }}
            >
              Track Existing Parcel
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="text-white py-16"
        style={{
          background:
            "linear-gradient(135deg, #030637 0%, #3C0753 50%, #720455 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-white" />
                <h3 className="text-2xl font-bold">ParcelTrack</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Your trusted partner for fast, secure, and reliable parcel
                delivery services. We ensure your packages reach their
                destination safely and on time.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/track"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Package Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Express Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Same Day Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    International Shipping
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Insurance Coverage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Bulk Shipping
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/login"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Track Package
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-200">
                      123 Delivery Street
                      <br />
                      Dhaka 1000, Bangladesh
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-200">+880 1234-567890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-200">support@parceltrack.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-300" />
                  <div className="text-gray-200">
                    <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
                    <p>Sat - Sun: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white border-opacity-20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-200">
                © 2025 ParcelTrack. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Cookie Policy
                </a>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Refund Policy
                </a>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-200">
                <span>Made with</span>
                <svg
                  className="h-4 w-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
                <span>in Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
