import type { Metadata } from "next";
import "./globals.css";
import { kabel, obv } from "./fonts/fonts";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import ConnectDB from "@/configs/db.config";
import PixelBlast from "@/components/ui/PixelBlast";
import { ThemeWrapper } from "@/providers/ThemeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Only Pay Home Page",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ConnectDB();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${kabel.variable} ${obv.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeWrapper>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
};
