import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Based Development",
  description: "Minimal, skill-focused Brazilian Jiu-Jitsu instruction.",
  icons: {
    icon: "/content/images/skill-based-development-icon.png",
    shortcut: "/content/images/skill-based-development-icon.png",
    apple: "/content/images/skill-based-development-icon.png",
  },
};

import Header from "./components/Header";
import Footer from "./components/Footer";


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"
      >

        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
