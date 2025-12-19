import { ReferralLayout } from "@/components/features/ReferralLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invite the Family 👨‍👩‍👧‍👦",
    description: "Get Free Daily $MomCoin when you invite friends.",
    openGraph: {
        title: "Invite the Family 👨‍👩‍👧‍👦",
        description: "Get Free Daily $MomCoin when you invite friends.",
        images: ["https://app.momcoined.com/og-preview.jpg"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://app.momcoined.com/og-preview.jpg",
        "fc:frame:button:1": "Get Free $MomCoin 🎁",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": "https://app.momcoined.com/referral",
    },
};

export default function ReferralPage() {
    return <ReferralLayout />;
}
