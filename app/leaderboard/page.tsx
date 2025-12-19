import { LeaderboardLayout } from "@/components/features/LeaderboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MomCoin Leaderboard 🏆",
    description: "Who is the best Mom? Check the rankings.",
    openGraph: {
        title: "MomCoin Leaderboard 🏆",
        description: "Who is the best Mom? Check the rankings.",
        images: ["https://app.momcoined.com/og-preview.jpg"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://app.momcoined.com/og-preview.jpg",
        "fc:frame:button:1": "View Leaderboard 🏆",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": "https://app.momcoined.com/leaderboard",
    },
};

export default function LeaderboardPage() {
    return <LeaderboardLayout />;
}
