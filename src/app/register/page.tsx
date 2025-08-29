"use client";

import Logo from "@/assets/icons/Logo";
import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-background mb-4">
              Join ParcelTrack Today
            </h2>
            <p className="text-lg text-background/80 mb-6">
              Experience seamless parcel tracking and delivery management with
              our modern platform.
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
                <span>Real-time parcel tracking</span>
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
                <span>Secure delivery management</span>
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
                <span>24/7 customer support</span>
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
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
