import React from "react";
import { Providers } from "@/components/providers/Providers";
import FarcasterProvider from "@/components/auth/FarcasterProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClientComponents } from "@/components/providers/ClientComponents";

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
        url: "https://app.momcoined.com/mom-visual-5.png",
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
    "fc:frame:image": "https://app.momcoined.com/mom-visual-5.png",
    "fc:frame:button:1": "Open Momcoined",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://app.momcoined.com",
    "fc:frame:post_url": "https://app.momcoined.com/api/frame",

    "base:app_id": "69356c7982a86756bfd57bd8",
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://app.momcoined.com/mom-visual-5.png",
      button: {
        title: "Open Momcoined",
        action: {
          type: "launch_frame",
          url: "https://app.momcoined.com",
          name: "Momcoined",
          splashImageUrl: "https://app.momcoined.com/mom-visual-5.png",
          splashBackgroundColor: "#DC2626"
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
            <ClientComponents />
            <Toaster position="bottom-center" />
          </Providers>
        </FarcasterProvider>
      </body>
    </html >
  );
}
