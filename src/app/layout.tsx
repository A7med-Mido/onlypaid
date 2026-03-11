import type { Metadata } from "next";
import "./globals.css";
import { kabel, obv } from "./fonts/fonts";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import AuthProvider from "@/auth/AuthProvider";
import ConnectDB from "@/configs/db.config";
import PixelBlast from "@/components/ui/PixelBlast";

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
        <AuthProvider>
          <Navbar />
          <div className="w-full h-screen absolute -z-10">
            <PixelBlast
              variant="square"
              pixelSize={3}
              color="#7EACB5"
              patternScale={2}
              patternDensity={1}
              pixelSizeJitter={0}
              enableRipples
              rippleSpeed={0.2}
              rippleThickness={0.10}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={12}
              speed={0.5}
              edgeFade={0.01}
              transparent
            />
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};
