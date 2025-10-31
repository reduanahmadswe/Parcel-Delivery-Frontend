import { Link } from "react-router-dom";
import { Cookie, ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
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
            <Cookie className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold text-foreground">
              Cookie Policy
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
              1. What Are Cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Types of Cookies We Use
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Essential Cookies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  These cookies are necessary for the website to function properly. They enable 
                  core functionality such as security, authentication, and network management.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Authentication tokens</li>
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Functional Cookies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  These cookies enable enhanced functionality and personalization, such as 
                  remembering your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Language preferences</li>
                  <li>Theme selection (dark/light mode)</li>
                  <li>User interface customization</li>
                  <li>Recently viewed parcels</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Page visit statistics</li>
                  <li>User behavior patterns</li>
                  <li>Performance monitoring</li>
                  <li>Error tracking</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  These cookies track your online activity to help deliver more relevant 
                  advertising or to limit how many times you see an advertisement.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Promotional campaign tracking</li>
                  <li>Conversion tracking</li>
                  <li>Retargeting</li>
                  <li>Social media integration</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. How We Use Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies for various purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>To keep you signed in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To understand how you use our website</li>
              <li>To improve our services and user experience</li>
              <li>To provide personalized content and recommendations</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Third-Party Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may use third-party services that set cookies on our website:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
              <li><strong>Payment Processors:</strong> To securely process transactions</li>
              <li><strong>Social Media Platforms:</strong> For social sharing features</li>
              <li><strong>Customer Support:</strong> For live chat and support services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Managing Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can manage 
              your cookie preferences through:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Browser Settings
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most browsers allow you to control cookies through their settings. You can set 
                  your browser to refuse cookies or delete certain cookies. However, please note 
                  that if you block or delete cookies, some features may not work properly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Browser-Specific Instructions
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                  <li><strong>Edge:</strong> Settings → Privacy and services → Cookies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Cookie Duration
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies we use have different lifespans:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
              <li><strong>Authentication Cookies:</strong> Remain active until you log out or for 30 days</li>
              <li><strong>Preference Cookies:</strong> Stored for up to 1 year</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Updates to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. Please check this page 
              periodically for updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about our use of cookies:
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

          <section className="mb-8">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-6 rounded-lg">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> By continuing to use our website, 
                you consent to our use of cookies as described in this policy. For more information 
                about how we handle your personal data, please read our{" "}
                <Link to="/privacy-policy" className="text-red-500 hover:text-red-600 underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
