import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LocalMarket - Productos Locales Directamente a tu Casa",
    template: "%s | LocalMarket",
  },
  description: "Conectamos productores locales con consumidores. Descubre productos frescos, sostenibles y de calidad directamente de tu comunidad.",
  keywords: ["productos locales", "mercado local", "productores locales", "comida fresca", "agricultura local", "comercio local", "sostenible", "productos artesanales"],
  authors: [{ name: "LocalMarket" }],
  creator: "LocalMarket",
  publisher: "LocalMarket",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://localmarket.com",
    siteName: "LocalMarket",
    title: "LocalMarket - Productos Locales Directamente a tu Casa",
    description: "Conectamos productores locales con consumidores. Productos frescos y sostenibles de tu comunidad.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LocalMarket - Productos Locales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalMarket - Productos Locales Directamente a tu Casa",
    description: "Conectamos productores locales con consumidores. Productos frescos y sostenibles de tu comunidad.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/localmarketlogo.jpg",
    shortcut: "/localmarketlogo.jpg",
    apple: "/localmarketlogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/jpeg" href="/localmarketlogo.jpg" />
        <link rel="apple-touch-icon" href="/localmarketlogo.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
