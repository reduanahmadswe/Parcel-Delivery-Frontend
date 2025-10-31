import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {}
      <div className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-950/20 dark:to-green-950/20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold text-foreground">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information you provide directly to us when you create an account, 
              place an order, or contact us. This includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Delivery addresses (sender and receiver)</li>
              <li>Payment information (processed securely)</li>
              <li>Parcel details and tracking information</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Process and deliver your parcels</li>
              <li>Send you order updates and notifications</li>
              <li>Improve our services and customer experience</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Delivery personnel to complete your orders</li>
              <li>Payment processors to handle transactions</li>
              <li>Service providers who assist our operations</li>
              <li>Law enforcement when legally required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information 
              from unauthorized access, alteration, or disclosure. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and personalize content. See our <Link to="/cookie-policy" className="text-red-500 hover:underline">Cookie Policy</Link> for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-foreground mb-2">
                <strong>Email:</strong> privacy@parceldelivery.com
              </p>
              <p className="text-foreground mb-2">
                <strong>Phone:</strong> +880 1700-000000
              </p>
              <p className="text-foreground">
                <strong>Address:</strong> 123 Main Street, Dhaka 1000, Bangladesh
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
