import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthenticationContext";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>{children}</main>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
              <Sonner />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
