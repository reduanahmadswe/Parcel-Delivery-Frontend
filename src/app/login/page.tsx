"use client";

import { useAuth } from "@/contexts/AuthContext";
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Package
            className="h-12 w-12"
            style={{
              background:
                "linear-gradient(135deg, #030637 0%, #3C0753 25%, #720455 75%, #910A67 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/register"
            className="font-medium transition-colors duration-200"
            style={{ color: "#720455" }}
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Test Credentials */}
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              background:
                "linear-gradient(135deg, rgba(3, 6, 55, 0.05) 0%, rgba(145, 10, 103, 0.05) 100%)",
              borderColor: "#720455",
            }}
          >
            <h3
              className="text-sm font-semibold mb-3 flex items-center"
              style={{ color: "#030637" }}
            >
              🔑 Test Credentials - Click to Auto-fill:
            </h3>
            <div className="grid gap-2">
              {testCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillTestCredentials(cred.email, cred.password)}
                  className="text-left text-xs bg-white px-3 py-2 rounded-md border transition-all duration-200 shadow-sm hover:shadow-md hover:text-white"
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
                  <div className="text-gray-500">Password: {cred.password}</div>
                </button>
              ))}
            </div>
            <p
              className="text-xs font-medium mt-2"
              style={{ color: "#3C0753" }}
            >
              💡 Click any credential above to automatically fill the login form
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#720455";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(114, 4, 85, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "";
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
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
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#720455";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(114, 4, 85, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "";
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #030637 0%, #3C0753 25%, #720455 75%, #910A67 100%)",
                }}
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
                <div className="w-full border-t border-gray-300" />
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
