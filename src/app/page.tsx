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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="text-white"
        style={{
          background:
            "linear-gradient(135deg, #030637 0%, #3C0753 25%, #720455 75%, #910A67 100%)",
        }}
      >
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
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 inline-flex items-center justify-center text-white"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <Package className="mr-2 h-5 w-5" />
                Book a Delivery
              </Link>
              <Link
                href="/track"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 inline-flex items-center justify-center"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.transform = "";
                }}
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
              className="block w-full text-white text-center py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #720455 0%, #910A67 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #3C0753 0%, #720455 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(114, 4, 85, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #720455 0%, #910A67 100%)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Go to Tracking Page
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ParcelTrack?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive parcel delivery solutions with
              cutting-edge technology and exceptional customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #720455 0%, #910A67 100%)",
                }}
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
        className="py-16 text-white"
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
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #720455 0%, #910A67 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #3C0753 0%, #720455 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(114, 4, 85, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #720455 0%, #910A67 100%)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Create Account
            </Link>
            <Link
              href="/track"
              className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              style={{
                borderColor: "#720455",
                color: "#720455",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #720455 0%, #910A67 100%)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
                e.currentTarget.style.color = "#720455";
                e.currentTarget.style.transform = "";
              }}
            >
              Track Existing Parcel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
