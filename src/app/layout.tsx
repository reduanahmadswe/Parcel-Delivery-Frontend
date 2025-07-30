import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthenticationContext";
import { ThemeProvider } from "@/contexts/ThemePreferenceContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParcelTrack - Modern Parcel Delivery Service",
  description:
    "Track, send, and manage your parcels with our comprehensive delivery service platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-theme text-theme-primary`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-theme">
              <Navigation />
              <main>{children}</main>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  },
                }}
              />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
