import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold text-foreground">
              Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Parcel Delivery services, you accept and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Service Description
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Parcel Delivery provides courier and logistics services throughout Bangladesh. Our services include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Express delivery within 24 hours</li>
              <li>Standard delivery within 2-3 business days</li>
              <li>Same-day delivery in selected areas</li>
              <li>Corporate delivery solutions</li>
              <li>International shipping services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not ship prohibited or illegal items</li>
              <li>Properly package items to prevent damage</li>
              <li>Pay all applicable fees and charges</li>
              <li>Maintain the security of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Prohibited Items
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The following items are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Illegal drugs and narcotics</li>
              <li>Weapons, explosives, and ammunition</li>
              <li>Hazardous materials</li>
              <li>Counterfeit goods</li>
              <li>Living animals or plants (without proper documentation)</li>
              <li>Perishable items without proper packaging</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Pricing and Payment
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Delivery fees are calculated based on:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Parcel weight and dimensions</li>
              <li>Delivery distance and location</li>
              <li>Service type selected</li>
              <li>Additional services requested</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Payment must be completed before shipment unless a credit account has been established.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Liability and Insurance
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our liability for lost or damaged parcels is limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>The actual value of the parcel (with proof of value)</li>
              <li>Maximum of BDT 10,000 unless additional insurance is purchased</li>
              <li>No liability for delays due to circumstances beyond our control</li>
              <li>Additional insurance available for high-value items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Cancellation and Refunds
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cancellation policy:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Full refund if cancelled before parcel pickup</li>
              <li>50% refund if cancelled after pickup but before dispatch</li>
              <li>No refund after parcel is dispatched</li>
              <li>Refunds processed within 7-10 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Dispute Resolution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising from these terms will be resolved through good faith negotiations. 
              If resolution cannot be reached, disputes will be subject to the jurisdiction of 
              Bangladesh courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of our services 
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about these Terms of Service:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-foreground mb-2">
                <strong>Email:</strong> legal@parceldelivery.com
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
