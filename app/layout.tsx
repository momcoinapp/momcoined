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
  title: "MomCoin - The Mom Movement",
  description: "Empowering moms with crypto. Daily claims, social tasks, and rewards.",
  manifest: "/manifest.json",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://app.momcoined.com/mom-visual-5.png",
      button: {
        title: "Claim FREE $MomCoin! 🚀",
        action: {
          type: "launch_frame",
          name: "MomCoin",
          url: "https://app.momcoined.com",
          splashImageUrl: "https://app.momcoined.com/mom-visual-5.png",
          splashBackgroundColor: "#ec4899"
        }
      }
    }),
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://app.momcoined.com/mom-visual-5.png",
      button: {
        title: "Claim Daily Rewards",
        action: {
          type: "launch_frame",
          name: "MomCoin",
          url: "https://app.momcoined.com",
          splashImageUrl: "https://app.momcoined.com/mom-visual-5.png",
          splashBackgroundColor: "#ec4899"
        }
      }
    }),
    "baseBuilder": JSON.stringify({
      "ownerAddress": "0x320787f0b6c163aebCfFE308A9695Aa5e9761B5e"
    }),
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
    </html>
  );
}
