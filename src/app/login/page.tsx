"use client";

import { useAuth } from "@/contexts/AuthenticationContext";
import { Eye, EyeOff, LogIn, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      router.push("/");
    }

    setLoading(false);
  };

  // Test credentials for easy testing
  const testCredentials = [
    { role: "Admin", email: "admin@parceldelivery.com", password: "Admin123!" },
    { role: "Sender", email: "sender@example.com", password: "password123" },
    {
      role: "Receiver",
      email: "receiver@example.com",
      password: "password123",
    },
  ];

  const fillTestCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-theme flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Package
            className="h-12 w-12 text-brand-light gradient-brand"
            style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-theme-primary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-theme-secondary">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-brand-medium hover:text-brand-light transition-colors duration-200"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-brand sm:rounded-lg sm:px-10 border border-theme">
          {/* Test Credentials */}
          <div className="mb-6 p-4 rounded-lg border border-brand-medium bg-brand-medium/5">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-brand-darkest">
              🔑 Test Credentials - Click to Auto-fill:
            </h3>
            <div className="grid gap-2">
              {testCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillTestCredentials(cred.email, cred.password)}
                  className="text-left text-xs bg-theme px-3 py-2 rounded-md border border-theme transition-all duration-200 shadow-brand-sm hover:shadow-brand-md hover:text-white hover:gradient-brand text-theme-primary"
                  style={{ borderColor: "#720455" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #720455 0%, #910A67 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div className="font-medium" style={{ color: "#030637" }}>
                    {cred.role}
                  </div>
                  <div className="text-gray-600">{cred.email}</div>
                  <div className="text-theme-muted">
                    Password: {cred.password}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs font-medium mt-2 text-brand-dark">
              💡 Click any credential above to automatically fill the login form
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-theme-primary"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-theme rounded-md placeholder-theme-muted text-theme-primary bg-theme focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-theme-primary"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-theme rounded-md placeholder-theme-muted text-theme-primary bg-theme focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-theme-muted" />
                  ) : (
                    <Eye className="h-4 w-4 text-theme-muted" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-brand-sm text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-brand-lg transform hover:scale-105 gradient-brand"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-white transition-all duration-200 hover:shadow-md"
                style={{ borderColor: "#720455", color: "#720455" }}
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
