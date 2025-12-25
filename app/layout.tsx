import React from "react";
import { Providers } from "@/components/providers/Providers";
import FarcasterProvider from "@/components/auth/FarcasterProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { WelcomeOverlay } from "@/components/ui/WelcomeOverlay";
import { FloatingMomAI } from "@/components/features/FloatingMomAI";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Momcoined – NFT Holiday Cards on Base | MomAI, Rewards & Real Change",
  description: "Send free NFT holiday cards, claim MOMCOIN rewards. Real mom & son building trust on Base. MomAI advice, BaseMomz NFTs, housing Americans, helping trafficking victims.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Momcoin ❤️ Real Mom & Son on Base",
    description: "MomAI • BaseMomz/BaseKidz NFTs • Learn & Earn Rewards • Housing Americans 🏠 Helping Trafficking Victims 💪 Real change, real trust on Base.",
    images: [
      {
        url: "https://app.momcoined.com/og-image.png?v=dec20",
        width: 1200,
        height: 630,
        alt: "Momcoin – glowing cookie jar, mom & son, Base utility & social good",
      },
    ],
    url: "https://app.momcoined.com",
    type: "website",
    siteName: "Momcoin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momcoin ❤️ Real Utility on Base",
    description: "MomAI • BaseMomz/BaseKidz • Learn & Earn • Real Social Good 🏠💪",
    images: ["https://app.momcoined.com/og-image.png?v=dec20"],
    creator: "@momcoined",
    site: "@momcoined",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://app.momcoined.com/og-image.png?v=dec20",
    "fc:frame:button:1": "🍪 Claim 100 $MOM",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://app.momcoined.com/earn",
    "fc:frame:button:2": "🎁 Send FREE Card",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://app.momcoined.com/cards",

    "baseBuilder": "{\"ownerAddress\":\"0x320787f0b6c163aebCfFE308A9695Aa5e9761B5e\"}",
    "base:app_id": "69356c7982a86756bfd57bd8",
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://app.momcoined.com/hero.jpeg",
      button: {
        title: "Open Momcoined",
        action: {
          type: "launch_frame",
          url: "https://app.momcoined.com"
        }
      }
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <FarcasterProvider>
          <Providers>
            <div className="particles" />
            <Navbar />
            <main className="min-h-screen flex flex-col pt-16">
              {children}
              <Footer />
            </main>
            <FloatingMomAI />
            <Toaster position="bottom-center" />
          </Providers>
        </FarcasterProvider>
      </body>
    </html >
  );
}
