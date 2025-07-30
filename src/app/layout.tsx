import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParcelTrack - Modern Parcel Delivery Service",
  description: "Track, send, and manage your parcels with our comprehensive delivery service platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
