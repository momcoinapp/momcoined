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
    "fc:frame": "vNext",
    "fc:frame:image": "https://app.momcoined.com/mom-visual-5.png",
    "fc:frame:button:1": "🍪 Claim Daily $MOM",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://app.momcoined.com/earn",
    "fc:frame:button:2": "🏠 Mint Mom/Kid NFT",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://app.momcoined.com/nfts",
    "fc:miniapp": "1",
    "fc:miniapp:action": "launch_frame",
    "fc:miniapp:name": "MomCoin",
    "fc:miniapp:button": "Claim Daily $MOM",
    "fc:miniapp:icon": "https://app.momcoined.com/mom-coin-logo.jpg",
    "baseBuilder": JSON.stringify({
      "ownerAddress": "0x320787f0b6c163aebCfFE308A9695Aa5e9761B5e"
    }),
  },


  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return(
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
