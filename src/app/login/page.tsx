"use client";

import Logo from "@/assets/icons/Logo";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background/20" />
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-lg text-center">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-background/10 p-6">
                <div className="rounded-full bg-background/10 p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-background mb-4">
              Welcome Back to ParcelTrack
            </h2>
            <p className="text-lg text-background/80 mb-6">
              Sign in to access your parcel management dashboard and track your
              deliveries.
            </p>
            <div className="grid grid-cols-1 gap-4 text-background/70">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-background/10 p-1">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Access your dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-background/10 p-1">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Track your parcels</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-background/10 p-1">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Manage deliveries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
