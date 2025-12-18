import { StatsLayout } from "@/components/features/StatsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MomCoin Stats 📈",
    description: "Live Price, Holders, and Market Cap.",
    openGraph: {
        title: "MomCoin Stats 📈",
        description: "Live Price, Holders, and Market Cap.",
        images: ["https://momcoined.com/og-image.png"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://momcoined.com/og-image.png",
        "fc:frame:button:1": "View Live Stats 📈",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": "https://app.momcoined.com/stats",
    },
};

export default function StatsPage() {
    return <StatsLayout />;
}
