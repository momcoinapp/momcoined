import { Providers } from "@/components/providers/Providers";
import { Footer } from "@/components/layout/Footer";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
    "fc:frame:image": "https://momcoined.com/og-image.png",
    "fc:frame:button:1": "Launch App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://app.momcoined.com",
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
        <Providers>
          <div className="particles" />
          <main className="min-h-screen flex flex-col">
            {children}
            <Footer />
          </main>
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
