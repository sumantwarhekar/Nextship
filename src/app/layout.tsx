import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../../components/Navbar';
import Providers from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "NextShip - Social Media Platform",
  description: "A modern social media platform built with Next.js and Firebase. Share your thoughts, connect with others, and join the conversation.",
  keywords: ["social media", "blog", "Next.js", "Firebase", "community"],
  authors: [{ name: "NextShip Team" }],
  openGraph: {
    title: "NextShip - Social Media Platform",
    description: "A modern social media platform built with Next.js and Firebase. Share your thoughts, connect with others, and join the conversation.",
    url: "https://yoursite.com",
    siteName: "NextShip",
    images: [
      {
        url: "/next.svg",
        width: 1200,
        height: 630,
        alt: "NextShip - Social Media Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextShip - Social Media Platform",
    description: "A modern social media platform built with Next.js and Firebase. Share your thoughts, connect with others, and join the conversation.",
    images: ["/next.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
