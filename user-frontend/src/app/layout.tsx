import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Your one-stop shop for everything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`${inter.className} min-h-full`}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-full">
              <Navbar />
              <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <Toaster position="top-right" />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
